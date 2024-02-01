import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateProfile,
  changePassword,
} from "../controllers/users.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();
export default userRouter;

userRouter.route("/register").post(upload.single("image"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/profile").get(verifyJWT, getUserDetails);
userRouter.route("/changeProfile").put(verifyJWT, updateProfile);
userRouter.route("/changePassword").put(verifyJWT, changePassword);
