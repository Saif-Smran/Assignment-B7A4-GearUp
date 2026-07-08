import { prisma } from "../../lib/prisma";
import { CreateGearPayload } from "./provider.interface";


const createGearToInventory = async (userId: string ,gearPayload: CreateGearPayload) => {
    const { name, description, pricePerDay, quantity, providerId, image, brand, category } = gearPayload;

    let catagoryDb = await prisma.category.findUnique({
        where: {
            name: category
        }
    })

    if (!catagoryDb) {
        const newCategory = await prisma.category.create({
            data: {
                name: category
            }
        })
        catagoryDb = newCategory
    }

    const gear = await prisma.gearItem.create({
        data: {
            name,
            description,
            pricePerDay,
            quantityTotal: quantity,
            quantityAvail: quantity,
            providerId : userId,
            images: image,
            brand,
            categoryId: catagoryDb.id
        }
    })
    return gear
}


export const providerService = {
    createGearToInventory
}