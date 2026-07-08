import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: Role;
                phone?: number;
            };
        }
    }
}

const router = Router();

router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshAccessToken);
router.get('/me', auth(Role.ADMIN,Role.CUSTOMER,Role.PROVIDER) , authController.getCurrentUser);
router.put('/me', auth(Role.ADMIN,Role.CUSTOMER,Role.PROVIDER) , authController.updateUser);



export const authRouter = router;