import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const validateJwt = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id, tp_status: "ACTIVE" });
    console.log({ _id, user });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, this user might be deleted" });
    }

    req.loggedUser = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token or token expired" });
  }
};
