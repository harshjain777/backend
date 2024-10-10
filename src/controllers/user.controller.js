import { asyncHandler } from "../utils/asyncHandler.js";
import {APIerror} from '../utils/APIerror.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";


const refreshTokenAndAccessToken = async (userId) =>{

    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {refreshToken,accessToken}


    } catch (error) {

        throw new APIerror(500,"something went wrong while crreating refesh token and access token!")
        
    }

}


const registerUser = asyncHandler(async (req, res) => {
    //get user detials from frontend || postman
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


const loginUser = asyncHandler(async(req,res)=>{
    //req.body to get input
    // username || email
    //check for user existence!
    // password check
    // we will give acess token refresh token

    const {email,username,password} = req.body;

    if(!email||!username){
        throw new APIerror(400,"email or username is required");
    }

    const existingUser = await User.findOne({$or : [{username},{email}]});

    if(!existingUser){
        throw new APIerror(404,"user does not exists!")
    }

    const isValidPassword = existingUser.isPasswordCorrect(password)

    if(!isValidPassword){
        throw new APIerror(401,"invalid user credentials!");
    }

    const {refreshToken, accessToken} = await refreshTokenAndAccessToken(existingUser._id)

    const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")



    const options = {
        httpOnly: true,
        secure:true

    }

    res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(new APIresponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user loggedIn successfully"
    ))




})


const logoutUser = asyncHandler(async(req,res)=>{
    //refresh accesstoken lenge , we will clear cookie
    //database se refresh token lelenge
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken:undefined}
        },{
            new :true
        }

    )

    const options = {
        httpOnly: true,
        secure:true

    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new APIresponse(200,{},"User logged out"))
})


export {
    registerUser,
    loginUser,
    logoutUser
}