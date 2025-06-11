import jwt from 'jsonwebtoken';

export const CheckAuth = async (req, res, next) => {
  try {
   console.log("Hello")
    next();
  } catch (error) {
    console.error("CheckAuth error", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
