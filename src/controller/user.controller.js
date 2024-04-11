import UserModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res) => {
  const { limit = 5, page = 0 } = req.query;

  const query = { tp_status: "ACTIVE" };
  const [total, users] = await Promise.allSettled([
    UserModel.countDocuments(query)
      .limit(parseInt(limit))
      .skip(parseInt(page) * parseInt(limit)),
    UserModel.find(query)
      .select("name lastname email role")
      .limit(parseInt(limit))
      .skip(parseInt(page) * parseInt(limit)),
  ]);

  res.status(200).json({
    total: total.value,
    page,
    users: users.value,
  });
};

export const createUser = async (req, res) => {
  const { name, lastname, email, password, role } = req.body;
  const salt = bcryptjs.genSaltSync();
  const encryptedPassword = bcryptjs.hashSync(password, salt);
  const user = new UserModel({
    name,
    lastname,
    email,
    password: encryptedPassword,
    role,
  });
  await user.save();

  res.status(201).json({ user });
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id, tp_status: "ACTIVE" }).select(
    "name lastname email role",
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, email, password, role } = req.body;
  const userUpdated = { name, lastname, email, password, role };

  Object.keys(userUpdated).forEach((key) => {
    if (userUpdated[key] === undefined) {
      delete userUpdated[key];
    }
  });

  const user = await UserModel.findOneAndUpdate(
    { _id: id, tp_status: "ACTIVE" },
    userUpdated,
  ).select("name lastname email role password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user: { ...user._doc, ...userUpdated },
  });
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOneAndUpdate(
    { _id: id, tp_status: "ACTIVE" },
    { tp_status: "INACTIVE" },
  ).select("name lastname email role");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
};
