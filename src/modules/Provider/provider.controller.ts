import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CreateGearPayload } from "./provider.interface";
import { providerService } from "./provider.service";
import sendResponse from "../../utils/sendResponce";
import httpStatus from "http-status";
import { RentalStatus } from "../../../generated/prisma/client";


const createGear = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const payload: CreateGearPayload = req.body;

    const result = await providerService.createGearToInventory(userId!, payload);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear created successfully",
        data: result
    })
})

const updateGearById = catchAsync(async (req: Request, res: Response) => {
    const gearId  = req.params.id;
    const updateData: Partial<CreateGearPayload> = req.body;

    const result = await providerService.updateGearById(gearId as string, updateData);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear updated successfully",
        data: result
    })
})

const deleteGearById = catchAsync(async (req: Request, res: Response) => {
    const gearId  = req.params.id;

    const result = await providerService.deleteGearById(gearId as string);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear deleted successfully",
        data: result
    })
})

const getAllOrdersByProviderId = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.user?.id;

    const result = await providerService.getAllOrdersByProviderId(providerId!);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Orders fetched successfully",
        data: result
    })
})

const updateorderStatus = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const result = await providerService.updateorderStatus(orderId as string, status as RentalStatus);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Order status updated successfully",
        data: result
    })
})

export const providerController = {
    createGear,
    updateGearById,
    deleteGearById,
    updateorderStatus,
    getAllOrdersByProviderId
}
   