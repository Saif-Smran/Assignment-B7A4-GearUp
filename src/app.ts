import { Application, Request, Response } from "express"
import express from "express"
import cors from "cors"
import { config } from "./config"
import cookiesParser from "cookie-parser"
import { Role } from "../generated/prisma/client"

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookiesParser()) // for parsing cookies

app.get('/', (req: Request, res: Response) => {
    res.send('GearUp - Rent Sports & Outdoor Gear Instantly! API is running successfully.')
})

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: Role;
            };
        }
    }
}

export default app