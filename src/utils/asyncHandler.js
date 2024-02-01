
// const asyncHandler = (func) => {
//     return (req,res,next) => {
//         Promise.resolve(func(req,res,next)).catch((err) => {next(err)
//         })
//     }
// }

// export default asyncHandler

const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((err) => {
            next(err); // next(err) means passing err to next middleware
        });
    };
};

export default asyncHandler;