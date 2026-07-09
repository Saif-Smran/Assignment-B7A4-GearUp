import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../utils/sendResponce";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Users fetched successfully",
        data: result
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { status } = req.body;

    const result = await adminService.updateUserStatus(userId as string, status);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "User status updated successfully",
        data: result
    })
})

const getAllGearItems = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllGearItems();
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear items fetched successfully",
        data: result
    })
})

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllRentalOrders();
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Orders fetched successfully",
        data: result
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllGearItems,
    getAllOrders
}