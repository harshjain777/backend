import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js"; 

const connectBD = async()=>{
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n mongoDB got connected !! Db host ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.error("Mongo Db connection failed",error)
        process.exit(1)
    }
}

export default connectBD