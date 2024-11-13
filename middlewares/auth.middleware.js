import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Check if token is present
    if (!token) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Verify the token using JWT
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    // Find the user based on decoded token
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Attach user to request object for further use
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};
