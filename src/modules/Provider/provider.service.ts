import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateGearPayload } from "./provider.interface";


const createGearToInventory = async (userId: string, gearPayload: CreateGearPayload) => {
    const { name, description, pricePerDay, quantityTotal, images, brand, category } = gearPayload;


    const gear = await prisma.gearItem.create({
        data: {
            name,
            description,
            pricePerDay,
            quantityTotal: quantityTotal,
            quantityAvail: quantityTotal,
            providerId: userId,
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

const getAllOrdersByProviderId = async (providerId: string) => {

    const orderItems = await prisma.rentalOrderItem.findMany({
        where: {
            gearItem: {
                providerId: providerId,
            },
        },
        include: {
            gearItem: true,
            rentalOrder: {
                include: {
                    customer: {
                        select: {
                            id: true, name: true, email: true, phone: true,
                        },

                    },
                },
            },
        },
        orderBy: {
            rentalOrder: { createdAt: "desc" },
        },
    });

    return orderItems;
}

const updateorderStatus = async (orderId: string, status: RentalStatus) => {
    const order = await prisma.rentalOrder.update({
        where: {
            id: orderId
        },
        data: {
            status: status
        }
    })
    return order
}

export const providerService = {
    createGearToInventory,
    updateGearById,
    deleteGearById,
    getAllOrdersByProviderId,
    updateorderStatus
}