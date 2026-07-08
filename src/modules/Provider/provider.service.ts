import { prisma } from "../../lib/prisma";
import { CreateGearPayload } from "./provider.interface";


const createGearToInventory = async (userId: string ,gearPayload: CreateGearPayload) => {
    const { name, description, pricePerDay, quantityTotal, images, brand, category } = gearPayload;


    const gear = await prisma.gearItem.create({
        data: {
            name,
            description,
            pricePerDay,
            quantityTotal: quantityTotal,
            quantityAvail: quantityTotal,
            providerId : userId,
            images,
            brand,
            category 
        }
    })
    return gear
}

const updateGearById = async (gearId: string, updateData: Partial<CreateGearPayload>) => {
    const gear = await prisma.gearItem.update({
        where: {
            id: gearId
        },
        data: updateData
    })
    return gear
}

const deleteGearById = async (gearId: string) => {
    const gear = await prisma.gearItem.delete({
        where: {
            id: gearId
        }
    })
    return gear
}


export const providerService = {
    createGearToInventory,
    updateGearById,
    deleteGearById
}