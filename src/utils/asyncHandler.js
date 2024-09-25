const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.log("got an error", err);
            next(err); // Make sure to call `next` with the error for proper error handling
        });
    };
};

export { asyncHandler };
