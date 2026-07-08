import sendResponse from "./sendResponce"
import httpStatus from "http-status"
import { NextFunction, Request, Response } from "express"

const catchAsync = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            // sendResponse(res, {
            //     success: false,
            //     status: httpStatus.INTERNAL_SERVER_ERROR,
            //     message: "Something went wrong",
            //     error: error
            // })
            next(error)
        }
    }
}

export default catchAsync