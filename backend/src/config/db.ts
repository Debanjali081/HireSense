const mongoose = require('mongoose');



const connectToDB = async (): Promise<void> => {
  try {
    const uri: string | undefined = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(uri.trim());
    console.log("MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
    } else {
      console.error("MongoDB connection error:", error);
    }

    process.exit(1);
  }
};

module.exports = connectToDB;