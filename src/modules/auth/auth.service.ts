import bcrypt from "bcryptjs";
import { CreateUserPayload, LoginUserPayload } from "./auth.interface";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { Jwt, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";

const createUserIntoDB = async (Payload: CreateUserPayload) => {

    const { email, name, password, role, phone } = Payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("User already exists", {
            cause: httpStatus.BAD_REQUEST
        })
    }

    if (role === "ADMIN") {
        throw new Error("You are not allowed to create an admin user", {
            cause: httpStatus.UNAUTHORIZED
        })
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role,
            phone
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id
        },
        omit: {
            password: true
        }
    })

    return user

}

const loginUserFromDB = async (payload: LoginUserPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw new Error("User not found", {
            cause: httpStatus.NOT_FOUND
        })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid password", {
            cause: httpStatus.UNAUTHORIZED
        })
    }

    const accessToken = jwtUtils.CreateToken(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    const refreshToken = jwtUtils.CreateToken(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )

    const newUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        omit: {
            password: true
        }
    })

    const response = {
        ...newUser,
        accessToken,
        refreshToken
    }

    return response
}

const refreshToken = async (payload: { refreshToken: string }) => {

    const { refreshToken } = payload;

    const verifiedRefreshToken = jwtUtils.VerifyToken(refreshToken, config.jwt_refresh_secret)

    if (!verifiedRefreshToken) {
        throw new Error("Invalid refresh token")
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: verifiedRefreshToken.id
        }
    })

    const jwtPaylode = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.CreateToken(
        jwtPaylode,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    return ({
        user,
        accessToken,
        refreshToken 
    })
}

const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })
    
    return user
}

const updateUser = async (userId: string, payload: Partial<CreateUserPayload>) => {

    if (payload?.password) {
        throw new Error("You are not allowed to update password using this route. Use update password route", {
            cause: httpStatus.BAD_REQUEST
        })
    }

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: payload
    })

    return user
}

export const authService = {
    createUserIntoDB,
    loginUserFromDB,
    refreshToken,
    getCurrentUser,
    updateUser
}