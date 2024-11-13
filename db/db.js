import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const URI = process.env.MONGODB_URL;
    await mongoose.connect(URI, {
      useNewUrlParser: true,
    });
    ("mongoDb connected successfully.");
  } catch (error) {
    error;
    process.exit(1);
  }
};
