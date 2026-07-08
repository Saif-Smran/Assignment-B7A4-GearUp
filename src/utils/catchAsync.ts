import sendResponse from "./sendResponce"
import httpStatus from "http-status"
import { NextFunction, Request, Response } from "express"

const catchAsync = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error : any) {
            // sendResponse(res, {
            //     success: false,
            //     status: error?.cause || httpStatus.INTERNAL_SERVER_ERROR,
            //     message: error?.message || "Internal Server Error",
            //     error: error
            // })
            next(error)
        }
    }
}

export default catchAsync