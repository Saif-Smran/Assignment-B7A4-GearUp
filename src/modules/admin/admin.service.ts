import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });
    return users;
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status: status
        },
        omit: { password: true } // Exclude the password field from the returned user object
    });
    return updatedUser;
};

const getAllGearItems = async () => {
    const gearItems = await prisma.gearItem.findMany({
        select: {
            id: true,
            name: true,
            category: true,
            brand: true,
            pricePerDay: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            reviews: {
                select: {
                    rating: true,
                    comment: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        where: {
            isActive: true
        }
    });
    return gearItems;
};

const getAllRentalOrders = async () => {
    const rentalOrders = await prisma.rentalOrder.findMany({
        select: {
            id: true,
            customerId: true,
            customer: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                }
            },
            items: {
                select: {
                    gearItem: {
                        select: {
                            name: true,
                            category: true,
                            brand: true,
                            pricePerDay: true,
                        }
                    },
                    quantity: true,
                }
            },
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });
    return rentalOrders;
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllGearItems,
    getAllRentalOrders
};