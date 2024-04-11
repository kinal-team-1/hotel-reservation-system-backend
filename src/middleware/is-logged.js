import { ADMIN_HOTEL_ROLE, CLIENT_ROLE } from "../model/user.model.js";

export const isAdminLogged = (req, res, next) => {
  const { loggedUser } = req;

  if (loggedUser.role !== ADMIN_HOTEL_ROLE) {
    return res.status(403).json({ message: "You must be an admin" });
  }

  next();
};

export const isClientLogged = (req, res, next) => {
  const { loggedUser } = req;

  if (loggedUser.role !== CLIENT_ROLE) {
    return res.status(403).json({ message: "You must be a client" });
  }

  next();
};
