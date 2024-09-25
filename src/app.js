import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
import pkg from 'body-parser';
const { urlencoded } = pkg;
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

//import user route
import userroute from './routes/user.routes.js'
//we use app . use cause its calling middleware!!!
app.use("/api/v1/user",userroute);

export {app}