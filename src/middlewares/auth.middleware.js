import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const userToken =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "" || "");
    // console.log(userToken);
    if (!userToken) {
      throw new ApiError(401, "Unauthorized Request...");
    }
    // console.log("token found");
    const decodedToken = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decodedToken");
    if (!decodedToken) {
      throw new ApiError("301", "Invalid Token...");
    }
    // console.log("Token Verifie");

    const user = await User.findById(decodedToken._id);
    // console.log(user);
    req.user = user;
    // console.log("printed user");
    next();
  } catch (error) {
    console.log("Error Verifying User...");
  }
});

export default verifyJWT;
