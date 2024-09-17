import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({

    username:{
        type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
    },
    email:{
        type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

},{timestamps:true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
    next()
    
})

userSchema.method.isPasswordCorrect=async function (password) {

    return await bcrypt.compare(password,this.password)
    
}


userSchema.method.generateAccessToken=function(){
    jwt.sign(
    {
        _id:this._id,
        username:this.username,
        fullName:this.fullName,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.method.generateRandomToken=function(){
    jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User",userSchema);
