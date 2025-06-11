import jwt from 'jsonwebtoken';
import { User } from "../models/admin.model.js";

export const CheckAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;  // Corrected

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token signature and decode payload
    const verifiedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    const userId = verifiedToken.userId;
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(401).json({ message: "Invalid user ID" });
    }

    // Optionally attach user info to request
    req.user = findUser;

    next();
  } catch (error) {
    console.error("CheckAuth error", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
