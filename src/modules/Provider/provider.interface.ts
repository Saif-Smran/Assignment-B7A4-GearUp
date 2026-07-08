import { Category } from "../../../generated/prisma/client";

export interface CreateGearPayload {
    name: string;
    description: string;
    pricePerDay: number;
    quantityTotal: number;
    images: string[];
    brand?: string;
    category: Category;
}