import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import auth from "../../middleware/auth";
import { paymentController } from "./payments.controller";

const router = Router();

router.post('/create', auth(Role.CUSTOMER), paymentController.createPayment);
router.post('/confirm', paymentController.confirmPayment);
router.get('/:id', auth(Role.CUSTOMER), paymentController.getMyPaymentById);
router.get('/', auth(Role.CUSTOMER), paymentController.getMyPayments);





export const paymentRouter = router;