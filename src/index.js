import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './db/connect.js'

dotenv.config({
    path: './env'
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
    console.log("Server Running At: ", process.env.PORT)     
    })
}).catch(() => {
    console.log("Connecting Database Failed...")
})