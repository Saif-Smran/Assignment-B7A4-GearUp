import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router()

router.get('/users', adminController.getAllUsers)
router.patch('/users/:id', adminController.updateUserStatus)
router.get('/gear', adminController.getAllGearItems)
router.get('/rentals', adminController.getAllOrders)


export const adminRouter = router;