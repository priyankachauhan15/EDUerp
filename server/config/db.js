import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected");
    console.log("📌 Database Name:", mongoose.connection.name);

    const safeUrl = process.env.MONGO_URL?.replace(/\/\/(.*?):(.*?)@/, "//$1:****@");
    console.log("🌐 Connection URL:", safeUrl);

  } catch (error) {
    console.log("❌ DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;