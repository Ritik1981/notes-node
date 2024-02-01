import mongoose from 'mongoose'
// import fs from 'fs'

const DB_NAME = 'Keeper'
const connectDB = async (localFilePath) => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log("Database Succesfully connected...")
        console.log("\nDB Host: ",connectionInstance.connection.host)
    } catch (error) {
        console.log('Error Connecting Database: ',error)
    }
}

export default connectDB;