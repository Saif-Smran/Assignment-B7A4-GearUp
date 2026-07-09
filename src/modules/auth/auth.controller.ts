import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { CreateUserPayload } from "./auth.interface";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponce";
import { Prisma } from "../../../generated/prisma/client";

const createUser = catchAsync(async (req: Request, res: Response) => {

    const payload: CreateUserPayload = req.body;

    const result = await authService.createUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "User registered successfully",
        data: result
    })

})

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await authService.loginUserFromDB(payload);

    res.cookie("accessToken", result.accessToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });
    res.cookie("refreshToken", result.refreshToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "User logged in successfully",
        data: result
    })
})

const refreshAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        const { user, accessToken, refreshToken: PreviousRefreshToken } = await authService.refreshToken({ refreshToken });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });

        sendResponse(res, {
            success: true,
            status: httpStatus.OK,
            message: "Access token refreshed successfully",
            data: {
                user,
                accessToken,
                refreshToken: PreviousRefreshToken
            }
        })
    } catch (error) {
        sendResponse(res, {
            success: false,
            status: httpStatus.BAD_REQUEST,
            message: "Invalid refresh token",
            error: error
        })
    }
})

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await authService.getCurrentUser(userId!);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "User fetched successfully",
        data: result
    })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const payload: Partial<Prisma.UserUpdateInput> = req.body;

    const result = await authService.updateUser(userId!, payload );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "User updated successfully",
        data: result
    })
})

export const authController = {
    createUser,
    loginUser,
    refreshAccessToken,
    getCurrentUser,
    updateUser
}