export interface CreateGearPayload {
    name: string;
    description: string;
    pricePerDay: number;
    quantity: number;
    providerId: string;
    image: string[];
    brand?: string;
    category: string;
}