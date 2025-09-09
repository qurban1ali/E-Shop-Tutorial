
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw new Error("authentication failed");
  }
};

module.exports = connectDB;
