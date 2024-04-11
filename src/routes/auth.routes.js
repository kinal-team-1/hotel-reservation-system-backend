import { Router } from "express";
import { body } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import { login, signup } from "../controller/auth.controller.js";
import {
  ADMIN_HOTEL_ROLE,
  ADMIN_PLATFORM_ROLE,
  CLIENT_ROLE,
} from "../model/user.model.js";

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
  login,
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
    body(
      "role",
      `Role must be defined, must be one of these ${CLIENT_ROLE}, ${ADMIN_HOTEL_ROLE}, ${ADMIN_PLATFORM_ROLE}`,
    ).isIn([CLIENT_ROLE, ADMIN_HOTEL_ROLE, ADMIN_PLATFORM_ROLE]),
    validateRequestParams,
  ],
  signup,
);

export default router;
