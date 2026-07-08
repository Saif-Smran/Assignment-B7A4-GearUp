import app from "./app"
import { config } from "./config"
import { prisma } from "./lib/prisma"


const PORT = config.port 

async function main() {
    try{
        await prisma.$connect()
        console.log("Database Connected successfully")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch(e){
        console.log('Error starting server:', e)
        process.exit(1)
    }
}

main()