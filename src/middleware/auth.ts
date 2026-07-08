import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import catchAsync from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

const auth = (...requiredRoles : Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.accessToken ||
            (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization?.split(' ')[1] : req.headers.authorization);

        if (!token) {
            throw new Error("You are not authorized to access this resource. Please login first")
        }


        const verifiedAccessToken = jwtUtils.VerifyToken(token, process.env.JWT_ACCESS_SECRET as string)

        if (!verifiedAccessToken?.success) {
            throw new Error("Invalid or expired access token")
        }

        const { email, name, id, role } = verifiedAccessToken.data as JwtPayload

        if (!requiredRoles.includes(role as Role)) {
            throw new Error("Forbidden. You are not authorized to access this resource")
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        })

        if (!user) {
            throw new Error("User not found. Please login again")
        }

        if (user.status === "BLOCKED") {
            throw new Error("Your account has been blocked. Please contact support.")
        }

        req.user = {
            id,
            email,
            name,
            role
        }
        next();

    })
}

export default auth;

export {};