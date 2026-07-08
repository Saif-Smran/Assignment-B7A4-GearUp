import { Response } from "express";

type TMeta = {
    page: number;
    limit: number;
    total: number;
}

type TResponseData<T> ={
    success: boolean;
    status: number;
    message: string;
    data?: T;
    error?: T;
    meta?: TMeta;
}

const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    res.status(data.status).json(data)
}

export default sendResponse