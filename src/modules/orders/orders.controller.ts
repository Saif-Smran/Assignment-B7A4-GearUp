import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CreateOrderPayload } from "./orders.interface";
import sendResponse from "../../utils/sendResponce";
import { rentalOrderService } from "./orders.service";
import httpStatus from "http-status";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id;
    const orderData: CreateOrderPayload[] = req.body.items;

    const result = await rentalOrderService.createOrder(customerId!, orderData);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Order created successfully",
        data: result
    })
})

const getRentalOrders = catchAsync(async (req: Request, res: Response) => {
    
    const customerId = req.user?.id;

    const result = await rentalOrderService.getAllOrders(customerId);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Orders fetched successfully",
        data: result
    })
})

const getRentalOrderById = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const result = await rentalOrderService.getOrderById(orderId as string);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Order fetched successfully",
        data: result
    })
})

export const rentalOrderController = {
    createRentalOrder,
    getRentalOrders,
    getRentalOrderById
}