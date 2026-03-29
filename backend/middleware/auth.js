const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");


exports.isAuthenticatedUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHander("Please login to access this resource", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, "ABCD");

  const userId = decodedData.id.toString();
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHander("User not found ", 404));
  }

  req.user = user;
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // superadmin can access everything
    if (req.user.role === "superadmin") return next();
    
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
