import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponce";
import { ConfirmPaymentPayload, CreatePaymentPayload } from "./payment.interface";
import { paymentService } from "./payments.service";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";

const createPayment = catchAsync(async (req: Request, res: Response) => {
	const customerId = req.user?.id;
	const payload: CreatePaymentPayload = req.body;

	const result = await paymentService.createPayment(customerId!, payload);

	sendResponse(res, {
		success: true,
		status: httpStatus.OK,
		message: "Payment intent created successfully",
		data: result,
	});
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
	const signature = req.headers["stripe-signature"] as string | undefined;
	let payload: ConfirmPaymentPayload;

	if (Buffer.isBuffer(req.body)) {
		if (!signature) {
			throw new Error("Stripe signature header is missing", {
				cause: httpStatus.BAD_REQUEST,
			});
		}

		const event = stripe.webhooks.constructEvent(req.body, signature, config.stripe_webhook_secret);
		payload = event as unknown as ConfirmPaymentPayload;
	} else {
		payload = req.body;
	}

	const result = await paymentService.confirmPayment(payload);

	sendResponse(res, {
		success: true,
		status: httpStatus.OK,
		message: "Payment confirmed successfully",
		data: result,
	});
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
	const customerId = req.user?.id;
	const result = await paymentService.getMyPayments(customerId!);

	sendResponse(res, {
		success: true,
		status: httpStatus.OK,
		message: "Payments fetched successfully",
		data: result,
	});
});

const getMyPaymentById = catchAsync(async (req: Request, res: Response) => {
	const customerId = req.user?.id;
	const paymentId = req.params.id as string;

	const result = await paymentService.getMyPaymentById(paymentId, customerId!);

	sendResponse(res, {
		success: true,
		status: httpStatus.OK,
		message: "Payment fetched successfully",
		data: result,
	});
});

export const paymentController = {
	createPayment,
	confirmPayment,
	getMyPayments,
	getMyPaymentById,
};
