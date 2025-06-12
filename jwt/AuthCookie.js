import jwt from "jsonwebtoken";

export const createTokenAndSaveCookie = async ({userId,res}) => {
  try {
    // Ensure the secret key exists
    if (!process.env.SECRET_TOKEN) {
      throw new Error("SECRET_TOKEN is not defined in environment variables.");
    }

    // Create the token
    const token = jwt.sign({ userId }, process.env.SECRET_TOKEN, {
      expiresIn: "7d", // Token expiration time
    });

  
    res.cookie("jwt", token, {
      httpOnly: true, // Prevent client-side access to the cookie
      secure: true,  
      sameSite: "strict", // Strict CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    return token
  } catch (error) {
    console.error("Error creating token and setting cookie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
