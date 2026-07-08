import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CreateGearPayload } from "./provider.interface";
import { providerService } from "./provider.service";
import sendResponse from "../../utils/sendResponce";
import httpStatus from "http-status";


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

export const providerController = {
    createGear,
    updateGearById,
    deleteGearById
}