import { Router } from "express";
import { rentalOrderController } from "./orders.controller";

const router = Router()


router.post('/', rentalOrderController.createRentalOrder);
router.get('/:id', rentalOrderController.getRentalOrderById);
router.get('/', rentalOrderController.getRentalOrders);
export const orderRouter = router;