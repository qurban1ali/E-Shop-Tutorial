const app = require("./app");
const connectDB = require("./db/dataBase");
const cloudinary = require("cloudinary");
const path = require("path");
require("dotenv").config({
  path: "config/.env",
});

// ✅ Serve uploads folder outside backend
// const uploadsPath = path.resolve(__dirname, "../uploads");
// app.use("/uploads", require("express").static(uploadsPath));

// ✅ Debug: confirm uploads path
// console.log("Uploads served at:", uploadsPath);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
});

// Connect to DB and start server
(async () => {
  try {
    await connectDB();

    const server = app.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
    });
           
    // Handling unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.log(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
})();
