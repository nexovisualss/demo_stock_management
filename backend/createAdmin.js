// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("1234", 10);

    const user = new User({
      username: "admin",
      password: hashedPassword,
    });

    await user.save();

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();