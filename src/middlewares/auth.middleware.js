import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { APIerror } from "../utils/APIerror.js"

export const verifyJwt = asyncHandler(async(req,res,next) => {

    try {
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
    
    } catch (error) {

        throw new APIerror(500,error?.message||"somthing went wrong while invalid access token ")
        
    }
})