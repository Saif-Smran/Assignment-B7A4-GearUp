import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewService } from "./reviews.service";
import sendResponse from "../../utils/sendResponce";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userid = req.user?.id;
    const payload = req.body;
    const result = await reviewService.createReview(userid!, payload);
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Review created successfully",
        data: result
    })
})

export const reviewController = {
    createReview
}