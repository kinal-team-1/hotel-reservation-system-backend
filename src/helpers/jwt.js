import jwt from "jsonwebtoken";

export const generateToken = async (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
      algorithm: "HS256"
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
