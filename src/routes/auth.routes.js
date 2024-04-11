import { Router } from "express";
import { body } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import { login, signup } from "./auth.controller.js";
import bcryptjs from "bcryptjs";
import UserModel from "../user/user.model.js";

const router = Router();

router.post(
  "/login",
  [
    body("email", "Must be a valid Email").isEmail(),
    body("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    validateRequestParams,
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, tp_status: "ACTIVE" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });
  }
);

router.post(
  "/signup",
  [
    body("email", "Must be a valid Email").isEmail(),
    body("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    body("name", "Name is required").exists(),
    body("lastname", "Lastname is required").exists(),
    body("role", `Role must be defined, must be either ADMIN_ROLE or CLIENT_ROLE`)
      .isIn([ADMIN_ROLE, CLIENT_ROLE]),
    validateRequestParams,
  ],
  async (req, res) => {
    const { email, password, name, lastname, role } = req.body;
    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync(password, salt);
    const newUser = new UserModel({
      email,
      password: encryptedPassword,
      name,
      lastname,
      role,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
