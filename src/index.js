//require('dotenv').config({path:'./env'})

import dotenv from 'dotenv'
import connectBD from "./db/index.js"
import { app } from './app.js'

dotenv.config({
    path:'./env'
})


connectBD()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`the app is listening on ${process.env.PORT||3000}`);
        
    })
})
.catch((err)=>{
    console.log("mongo db connection failed!",err)
})













/*

;(async()=>{
    try {

        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        
    } catch (error) {
        console.error("you got erro",error)
        throw error
    }
})()

*/