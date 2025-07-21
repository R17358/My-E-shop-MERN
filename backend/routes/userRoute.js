const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const passport = require("passport");

const jwt = require("jsonwebtoken"); // ✅ ADD THIS
const User = require("../models/userModel"); // ✅ ADD THIS


const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// Google Auth - Step 1: Redirect to Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

const sendToken = require("../utils/jwtToken"); // adjust path
const jwt = require("jsonwebtoken");

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, "ABCD", {
      expiresIn: "15d",
    });

    // ✅ Redirect to frontend with token in query param
    res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
  }
);


// // Optional: Auth check
// router.get("/google-me", async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, "ABCD");

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(500).json({ message: "Invalid token or user" });
//   }
// });



module.exports = router;
