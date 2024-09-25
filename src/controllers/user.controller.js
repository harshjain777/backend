import { asyncHandler } from "../utils/asyncHandler.js";
import {APIerror} from '../utils/APIerror.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user deatials from frontend || postman
    //validation if empty?
    //check if user alredy exist username,email
    //check for avtar and images
    //upload them in cloudinary
    //create user object in and entry in => db
    //remove password and refresh token
    //check for user creation
    //return res

    const {fullName,email,username,password} = req.body
    console.log(email,"email")

    if([fullName,email,username,password].some((field)=>field?.trim()==='')){
        throw new APIerror(400,"All field is required")
    }

    const existedUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new APIerror(409,"user with email or username is existed!")
    }

    const avtarLocalPath = req.field?.avatar[0]?.path
    const coverImageLocal = req.field?.coverImage[0]?.path

    if(!avtarLocalPath){
        throw new APIerror(400,"upload your avatar");
    }

    const avatar = await uploadOnCloudinary(avtarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocal)

    if(!avatar){
        throw new APIerror(400,"upload your avatar");
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new APIerror(500,"somthing went wrong while registering!")
    }

    return res.status(201).json(
        new APIresponse(200,createdUser,"user registered successfully")
    )

});
export {registerUser}