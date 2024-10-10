import jwt from "jsonwebtoken"
import { User } from "../models/user.model"
import { asyncHandler } from "../utils/asyncHandler"
import { APIerror } from "../utils/APIerror"

const auth = asyncHandler(async(req,res,next) => {

    const token = req.cookies?.accessToken || req.header("Autherization")?.replace("Bearer","")

    if(!token){
        throw new APIerror(401,"Unathorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
        throw new APIerror(401,"Invalid Access Token")
    }

    req.user = user
    next();

})