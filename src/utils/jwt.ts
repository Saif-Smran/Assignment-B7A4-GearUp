import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const CreateToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions): string => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

const VerifyToken = (token: string, secret: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return {
            success: true,
            data: decoded
        }
    } catch (error: any) {
        return {
            success: false,
            data: error.message
        }
    }
}

export const jwtUtils = {
    CreateToken,
    VerifyToken
};