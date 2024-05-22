import { Router } from "express";
import { body } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  login,
  signup,
  signupHotel,
  validateToken,
  validateTokenAndGetVirtuals,
} from "../controller/auth.controller.js";
// import { isClientLogged, isHotelAdminLogged, isAdminLogged } from "../middleware/is-logged.js";
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

router.post(
  "/signup/hotel",
  [
    body("user.email", "Email is required and must be a valid email").isEmail(),
    body(
      "user.password",
      "Password is required and must be at least 6 characters long",
    ).isLength({ min: 6 }),
    body(
      "user.name",
      "Name is required and must be at least 3 characters long",
    ).isLength({ min: 3 }),
    body(
      "user.lastname",
      "Lastname is required and must be at least 3 characters long",
    ).isLength({ min: 3 }),
    body(
      "hotel.country",
      "Country is required and must be at least 3 characters long",
    ).isLength({ min: 3 }),
    body(
      "hotel.address",
      "Address is required and must be at least 10 characters long",
    ).isLength({ min: 10 }),
    body(
      "hotel.name",
      "Hotel name is required and must be at least 4 characters long",
    ).isLength({ min: 4 }),
    body(
      "hotel.description",
      "Description is required and must be at least 30 characters long",
    ).isLength({ min: 30 }),
  ],
  signupHotel,
);

router.get("/token", validateJwt, validateToken);
router.get("/token/admin", validateJwt, validateTokenAndGetVirtuals);

export default router;
