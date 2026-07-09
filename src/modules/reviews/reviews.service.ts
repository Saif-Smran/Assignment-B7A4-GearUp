import { prisma } from "../../lib/prisma"


const createReview = async ( userid : string ,payload: { rentalOrderId: string; gearItemId: string; rating: number; comment: string }) => {

    const { rentalOrderId, gearItemId, rating, comment } = payload;

    const review = await prisma.review.create({
        data: {
            customerId: userid,
            rentalOrderId,
            gearItemId,
            rating,
            comment
        }
    })
    return review
}


export const reviewService = {
    createReview
}