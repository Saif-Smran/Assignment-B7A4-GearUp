import { Prisma } from "../../../generated/prisma/client";
import { ReviewCreateManyRentalOrderInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "./orders.interface";
import httpStatus from "http-status";

const createOrder = async (customerId: string, orderData: CreateOrderPayload[]) => {
    if (!orderData || orderData.length === 0) {
        throw new Error("At least one gear item is required",{
            cause: httpStatus.BAD_REQUEST
        });
    }

    const result = await prisma.$transaction(async (tx) => {
        let totalAmount = new Prisma.Decimal(0);
        const orderItemsData = [];

        for (const item of orderData) {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
                throw new Error("Invalid rental date range", {
                    cause: httpStatus.BAD_REQUEST
                });
            }

            const gearItem = await tx.gearItem.findUnique({
                where: { id: item.gearItemId },
            });

            if (!gearItem || !gearItem.isActive) {
                throw new Error("Gear item not found", {
                    cause: httpStatus.NOT_FOUND
                });
            }

            if (gearItem.quantityAvail < item.quantity) {
                throw new Error("Not enough quantity available", {
                    cause: httpStatus.BAD_REQUEST
                });
            }

            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const subtotal = gearItem.pricePerDay.mul(days).mul(item.quantity);
            totalAmount = totalAmount.add(subtotal);

            await tx.gearItem.update({
                where: { id: item.gearItemId },
                data: { quantityAvail: { decrement: item.quantity } },
            });

            orderItemsData.push({
                gearItemId: item.gearItemId,
                quantity: item.quantity,
                startDate: start,
                endDate: end,
                pricePerDay: gearItem.pricePerDay,
                subtotal,
            });
        }

        const rentalOrder = await tx.rentalOrder.create({
            data: {
                customerId,
                totalAmount,
                status: "PLACED",
                items: { create: orderItemsData },
            },
            include: { items: true },
        });

        return rentalOrder;
    });

    if (!result) {
        throw new Error("Failed to create order", {
            cause: httpStatus.INTERNAL_SERVER_ERROR
        });
    }

    return result;
};

const getAllOrders = async (userId ?: string) => {
    const result = await prisma.rentalOrder.findMany({
        include: { items: true },
        where: userId ? { customerId: userId } : undefined
    });

    return result;
};

const getOrderById = async (orderId: string) => {
    const result = await prisma.rentalOrder.findUnique({
        include: { items: true },
        where: { id: orderId }
    });

    if (!result) {
        throw new Error("Order not found", {
            cause: httpStatus.NOT_FOUND
        });
    }

    return result;
};

export const rentalOrderService = {
    createOrder,
    getAllOrders,
    getOrderById
}