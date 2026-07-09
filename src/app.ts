import { Application, Request, Response } from "express"
import express from "express"
import cors from "cors"
import { config } from "./config"
import cookiesParser from "cookie-parser"
import { authRouter } from "./modules/auth/auth.route"
import { globalErrorHandler } from "./middleware/globalErrorHandler"
import { notFound } from "./middleware/notfound"
import { gearRouter } from "./modules/Gear/gear.route"
import { providerRouter } from "./modules/Provider/provider.route"
import auth from "./middleware/auth"
import { Role } from "../generated/prisma/enums"
import { orderRouter } from "./modules/orders/orders.route"
import { reviewRouter } from "./modules/reviews/reviews.route"
import { adminRouter } from "./modules/admin/admin.route"

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

app.use('/api/auth', authRouter)
app.use('/api/gear', gearRouter)
app.use('/api/provider', auth(Role.PROVIDER) , providerRouter)
app.use('/api/rentals', auth(Role.CUSTOMER), orderRouter)
app.use('/api/reviews', auth(Role.CUSTOMER), reviewRouter)
app.use('/api/admin', auth(Role.ADMIN), adminRouter)


app.use(globalErrorHandler)
app.use(notFound) 

export default app