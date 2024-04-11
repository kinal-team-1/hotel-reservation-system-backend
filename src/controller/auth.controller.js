import bcryptjs from "bcryptjs";
import UserModel from "../user/user.model.js";
import { generateToken } from "../helpers/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email, tp_status: "ACTIVE" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await generateToken(user);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { email, password, name, lastname, role } = req.body;
  try {
    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync(password, salt);
    const newUser = new UserModel({
      email,
      password: encryptedPassword,
      name,
      lastname,
      role,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
