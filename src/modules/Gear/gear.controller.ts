import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponce";
import { GearServices } from "./gear.service";
import httpStatus from "http-status";
import { searchGearQuery } from "./gear.interface";

const getAllGear = catchAsync(async (req: Request, res: Response) => {

    const query : searchGearQuery = req.query;

    const result = await GearServices.getAllGear(query);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear fetched successfully",
        data: result
    })
})

const getGearById = catchAsync(async (req: Request, res: Response) => {
    const gearId = req.params.id;

    const result = await GearServices.getGearById(gearId as string);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear fetched successfully",
        data: result
    })
})

const getAllGearCatagory = catchAsync(async (req: Request, res: Response) => {

   
    const result = await GearServices.getAllGearCatagory();
   
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Gear categories fetched successfully",
        data: result
    })
})


export const gearController = {
    getAllGear,
    getGearById,
    getAllGearCatagory
}