import { createTokenAndSaveCookie } from "../jwt/AuthCookie.js";
import { User } from "../models/admin.model.js"; // Adjust path & name if needed
import bcrypt from 'bcryptjs';

export const AddMember = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const findEmail = await User.findOne({ email });
    if (findEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 8);

    const newUser = new User({ username, email, password: hashpassword });
    await newUser.save();

    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    console.error("AddMember error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create token and set cookie
    const token = await createTokenAndSaveCookie({ userId: user._id, res });

    // Send success response after cookie is set
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ message: "Already logged out" });
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Logout error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
