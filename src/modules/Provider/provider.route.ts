import { Router } from "express";
import { providerController } from "./provider.controller";

const router = Router()

router.post('/gear', providerController.createGear);

export const providerRouter = router;