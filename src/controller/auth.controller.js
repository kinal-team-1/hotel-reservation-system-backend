import bcryptjs from "bcryptjs";
import UserModel, { ADMIN_HOTEL_ROLE } from "../model/user.model.js";
import { generateToken } from "../helpers/jwt.js";
import Hotel from "../model/hoteles.model.js";
import mongoose from "mongoose";
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

    const token = await generateToken(user.toJSON());
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

export const signupHotel = async (req, res) => {
  const { user, hotel } = req.body;
  const { email, password, name, lastname } = user;
  const { country, address, name: nameHotel, description } = hotel;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync(password, salt);
    const newUser = new UserModel({
      email,
      password: encryptedPassword,
      name,
      lastname,
      role: ADMIN_HOTEL_ROLE,
    });

    const newHotel = new Hotel({
      name: nameHotel,
      country,
      address,
      description,
      tp_status: "ACTIVE",
      user_admin: newUser._id,
    });

    await newUser.save();
    await newHotel.save();

    await session.commitTransaction();

    res
      .status(201)
      .json({
        message: "User created successfully",
        user: newUser,
        hotel: newHotel,
      });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

export const validateToken = async (req, res) => {
  // the validation will be done by the middleware, here we are
  // just gonna handle the success case
  return res.status(200).json({
    message: "User is authorized",
    data: req.loggedUser,
  });
};

export const validateTokenAndGetVirtuals = async (req, res) => {
  // the validation will be done by the middleware, here we are
  // just gonna handle the success case
  const user = req.loggedUser;
  const hotels = await Hotel.find({
    user_admin: user._id,
    tp_status: "ACTIVE",
  });
  return res.status(200).json({
    message: "User is authorized",
    data: { ...user.toJSON(), hotels },
  });
};
