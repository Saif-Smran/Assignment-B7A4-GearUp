import httpStatus from "http-status";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/client";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { ConfirmPaymentPayload, CreatePaymentPayload } from "./payment.interface";

const createPayment = async (customerId: string, payload: CreatePaymentPayload) => {
	const provider = payload.provider ?? "STRIPE";

	if (!payload.rentalOrderId) {
		throw new Error("Rental order id is required", {
			cause: httpStatus.BAD_REQUEST,
		});
	}

	const rentalOrder = await prisma.rentalOrder.findUnique({
		where: { id: payload.rentalOrderId },
		include: {
			payments: {
				orderBy: { createdAt: "desc" },
			},
		},
	});

	if (!rentalOrder || rentalOrder.customerId !== customerId) {
		throw new Error("Rental order not found", {
			cause: httpStatus.NOT_FOUND,
		});
	}

	if (rentalOrder.status === "CANCELLED") {
		throw new Error("Cancelled order cannot be paid", {
			cause: httpStatus.BAD_REQUEST,
		});
	}

	const completedPayment = rentalOrder.payments.find((payment) => payment.status === "COMPLETED");
	if (completedPayment) {
		throw new Error("This order is already paid", {
			cause: httpStatus.CONFLICT,
		});
	}

	const amountInCents = Math.round(Number(rentalOrder.totalAmount) * 100);

	if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
		throw new Error("Invalid payment amount", {
			cause: httpStatus.BAD_REQUEST,
		});
	}

	const checkoutSession = await stripe.checkout.sessions.create({
		mode: "payment",
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: `GearUp rental order ${rentalOrder.id}`,
						metadata: {
							rentalOrderId: rentalOrder.id,
						},
					},
					unit_amount: amountInCents,
				},
				quantity: 1,
			},
		],
		client_reference_id: rentalOrder.id,
		metadata: {
			rentalOrderId: rentalOrder.id,
			customerId,
		},
		success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${config.app_url}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
	});

	const payment = await prisma.payment.create({
		data: {
			transactionId: checkoutSession.id,
			rentalOrderId: rentalOrder.id,
			amount: rentalOrder.totalAmount,
			provider,
			status: "PENDING",
		},
	});

	return {
		payment,
		checkoutSessionId: checkoutSession.id,
		checkoutUrl: checkoutSession.url,
	};
};

const confirmPayment = async (payload: ConfirmPaymentPayload) => {
	const eventType = (payload.type || "").toLowerCase();
	const sessionObject = payload.data?.object;
	const rentalOrderId = payload.rentalOrderId || sessionObject?.metadata?.rentalOrderId || sessionObject?.client_reference_id;
	const transactionId =
		payload.paymentIntentId ||
		payload.payment_intent ||
		payload.transactionId ||
		(eventType === "checkout.session.completed" ? sessionObject?.id : undefined) ||
		sessionObject?.payment_intent ||
		sessionObject?.id ||
		payload.id;

	if (!transactionId) {
		throw new Error("Payment transaction id is required", {
			cause: httpStatus.BAD_REQUEST,
		});
	}

	const existingPayment = await prisma.payment.findUnique({
		where: { transactionId },
		include: {
			rentalOrder: true,
		},
	});

	if (!existingPayment) {
		console.log("Stripe webhook received without matching payment", {
			eventType,
			transactionId,
			rentalOrderId,
		});

		return {
			acknowledged: true,
			eventType,
			transactionId,
			rentalOrderId,
		};
	}

	console.log("Stripe webhook received", {
		eventType,
		transactionId,
		paymentId: existingPayment.id,
		orderId: existingPayment.rentalOrderId,
	});

	const statusText = (
		payload.status ||
		payload.payment_status ||
		payload.data?.object?.payment_status ||
		payload.data?.object?.status ||
		payload.type ||
		""
	).toLowerCase();
	const isSuccess =
		statusText.includes("succeeded") ||
		statusText.includes("paid") ||
		statusText.includes("success") ||
		statusText === "completed";

	const paymentStatus: PaymentStatus = isSuccess ? "COMPLETED" : "FAILED";

	const result = await prisma.$transaction(async (tx) => {
		const payment = await tx.payment.update({
			where: { id: existingPayment.id },
			data: {
				status: paymentStatus,
				paidAt: paymentStatus === "COMPLETED" ? new Date() : null,
			},
		});

		if (paymentStatus === "COMPLETED") {
			const updatableStatuses: RentalStatus[] = ["PLACED", "CONFIRMED"];

			if (updatableStatuses.includes(existingPayment.rentalOrder.status)) {
				await tx.rentalOrder.update({
					where: { id: existingPayment.rentalOrderId },
					data: { status: "PAID" },
				});
			}
		}

		return payment;
	});

    if (!result) {
        throw new Error("Payment not found", {
            cause: httpStatus.NOT_FOUND,
        });
    }

	return result;
};

const getMyPayments = async (customerId: string) => {
	const result = await prisma.payment.findMany({
		where: {
			rentalOrder: {
				customerId,
			},
		},
		include: {
			rentalOrder: {
				select: {
					id: true,
					status: true,
					totalAmount: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return result;
};

const getMyPaymentById = async (paymentId: string, customerId: string) => {
	const result = await prisma.payment.findFirst({
		where: {
			id: paymentId,
			rentalOrder: {
				customerId,
			},
		},
		include: {
			rentalOrder: {
				select: {
					id: true,
					status: true,
					totalAmount: true,
					customerId: true,
				},
			},
		},
	});

	if (!result) {
		throw new Error("Payment not found", {
			cause: httpStatus.NOT_FOUND,
		});
	}

	return result;
};

export const paymentService = {
	createPayment,
	confirmPayment,
	getMyPayments,
	getMyPaymentById,
};
