const express = require("express");
const app = express();

// ==============================
// Force HTTPS Redirect (for Render)
// ==============================
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// ==============================
// External Packages & Middlewares
// ==============================
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet"); // protection
const morgan = require("morgan"); // to debug using logs during development
const session = require("express-session");
const passport = require("passport"); // middleware for google auth

// ==============================
// Environment Config
// ==============================
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

// ==============================
// Passport Config
// ==============================
require("./config/passport");

// ==============================
// App Middlewares
// ==============================
app.use(helmet());

if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(morgan("dev"));
}

const corsOptions = {
  origin:
    process.env.NODE_ENV === "PRODUCTION"
      ? "https://hindustan-zone.vercel.app"
      : "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } })); // 10MB

app.use(
  session({
    secret: process.env.SESSION_SECRET || "ABCD",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "PRODUCTION",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ==============================
// Routes
// ==============================
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
const orderRoutes = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoute");

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// ==============================
// 404 Handler for API
// ==============================
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ==============================
// Serve Static Files (Frontend)
// ==============================
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// ==============================
// Error Middleware
// ==============================
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
