import { Response } from "express"
import { prisma } from "../../lib/prisma"
import { Prisma } from "../../../generated/prisma/client";
import { searchGearQuery } from "./gear.interface";

const getAllGear = async (Payload: searchGearQuery) => {
    const { category, minPrice, maxPrice, brand , name} = Payload;

    const andConditions: Prisma.GearItemWhereInput[] = [
        { isActive: true }, // never return delisted gear on public browse
    ];

    if (category) {
        andConditions.push({ category: category as Prisma.GearItemWhereInput["category"] });
    }

    if (brand) {
        andConditions.push({
            brand: { equals: brand as string, mode: "insensitive" },
        });
    }

    if (minPrice || maxPrice) {
        andConditions.push({
            pricePerDay: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
            },
        });
    }

    if (name) {
        andConditions.push({
            name: { contains: name as string, mode: "insensitive" },
        });
    }


    const gear = await prisma.gearItem.findMany({
        where: { AND: andConditions },
        orderBy: { createdAt: "desc" },
        include: {
            reviews: {
                select: {
                    rating: true,
                    comment: true,
                },
            },
        },
    });

    return gear;
};


const getGearById = async (gearId: string) => {
    const gear = await prisma.gearItem.findUnique({
        where: { id: gearId },
        include: {
            reviews: {
                select: {
                    rating: true,
                    comment: true,
                },
            },
        },
    });
    return gear;
};

const getAllGearCatagory = async () =>{
    const gear = await prisma.gearItem.findMany({
        select: { category: true },
        distinct: ["category"],
        orderBy: { createdAt: "desc" },
    });
    
    return gear;
}

export const GearServices = {
    getAllGear,
    getGearById,
    getAllGearCatagory
}
