import { Router } from "express";
import { body } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import { login, signup, validateToken } from "../controller/auth.controller.js";
import { isClientLogged, isHotelAdminLogged, isAdminLogged } from "../middleware/is-logged.js";
import { validateJwt } from "../middleware/validate-jwt.js";
import {
  ADMIN_HOTEL_ROLE,
  ADMIN_PLATFORM_ROLE,
  CLIENT_ROLE,
} from "../model/user.model.js";

const router = Router();

router.post(
  "/login",
  [
    body(
      "email",
      "The field `email` is required and must be a valid email",
    ).isEmail(),
    body(
      "password",
      "The field `password` is required and must be at least 6 characters long",
    ).isLength({
      min: 6,
    }),
    validateRequestParams,
  ],
  login,
);

router.post(
  "/signup",
  [
    body(
      "email",
      "The field `email` is required and must be a valid email",
    ).isEmail(),
    body(
      "password",
      "The field `password` is required and must be at least 6 characters long",
    ).isLength({
      min: 6,
    }),
    body(
      "name",
      "The field `name` is required and must be at least 3 characters long",
    )
      .exists()
      .isLength({ min: 3 }),
    body(
      "lastname",
      "The field `lastname` is required and must be at least 3 characters long",
    )
      .exists()
      .isLength({ min: 3 }),
    body(
      "role",
      `Role must be defined, must be one of these ${CLIENT_ROLE}, ${ADMIN_HOTEL_ROLE}, ${ADMIN_PLATFORM_ROLE}`,
    ).isIn([CLIENT_ROLE, ADMIN_HOTEL_ROLE, ADMIN_PLATFORM_ROLE]),
    validateRequestParams,
  ],
  signup,
);

router.get("/token", validateJwt, validateToken);

export default router;
