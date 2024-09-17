const asyncHandler = (fn)=>{
    (res,req,next)=>{
        Promise.resolve(fn(res,req,next)).catch((err)=>{console.log("got an error",err);
        })
    }
}
export {asyncHandler}