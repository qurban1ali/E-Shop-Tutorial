const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for frontend
app.use(
  cors({
    origin: "https://e-shop-tutorial-juch.vercel.app",
    credentials: true,
  })
);

// ✅ Serve uploads folder correctly (outside backend)
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/test", (req, res) => {
  res.send("Hello world!")
});

// Load environment variables (non-production)
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

// Use routes
app.use("/api/v2/user", user);
app.use("/api/v2/message", message);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/withdraw", withdraw);

// Global error handling
app.use(ErrorHandler);

module.exports = app;
