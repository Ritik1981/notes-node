import uploadOnCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
// import cookieParser from 'cookie-parser'

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error Generating Tokens...");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.file);
  const { name, email, password } = req.body;
  const imageLocalPath = req.file.path;

  // console.log(fullName, email);
  console.log(imageLocalPath);
  if (!(name || email || password || imageLocalPath)) {
    throw new ApiError(400, "All fields are required...");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Error Uploading on Cloudinary...");
  }
  console.log("Uploaded");
  console.log(image.url);
  const registeredUser = await User.create({
    image: image.url,
    name,
    email,
    password,
  });

  const user = await User.findById(registeredUser._id).select(
    " -password -refreshToken "
  );

  return res
    .status(200)
    .json(new ApiResponse(201, user, "Registered Successfully..."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    throw new ApiError(400, "All fields are required...");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(408, "InValid Credentials...");
  }

  const isPasswordCorrect = await user.isPassCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password...");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { accessToken, refreshToken },
        "Logged In Successfully..."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "Logged Out Successfully..."));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    " -password -refreshToken "
  );

  //   const userDetails = user.select(" -password -refreshToken ")

  if (!user) {
    throw new ApiError(410, "Unauthorized request...");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Fetched USer Details Successfully..."));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { newName } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, {
    name: newName,
  }).select(" -password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid Request...");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, user, "User Credentials updated successfully...")
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPassCorrect(oldpassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Unauthorized request...");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Updated Successfully...."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateProfile,
  changePassword,
};
