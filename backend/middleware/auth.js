const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, "ABCD");
 // console.log("Decoded Data:", decodedData);

  // Ensure that `decodedData.id` is a string before using it with MongoDB
  const userId = decodedData.id.toString();
  //console.log(userId)
  // Fetch user using the string version of the ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHander("User not found ", 404));
  }

  req.user = user; // Attach the found user to req.user for further use
  //console.log("User found:", req.user);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
