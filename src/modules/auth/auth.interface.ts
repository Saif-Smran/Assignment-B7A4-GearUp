import { Role } from "../../../generated/prisma/enums";

export interface CreateUserPayload {
    email: string;
    name: string;
    password: string;
    role: Role;
    phone?: string;
    status?: string;
}

export interface LoginUserPayload {
    email: string;
    password: string;
}