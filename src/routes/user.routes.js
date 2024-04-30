import { Router } from "express";
import {
  CLIENT_ROLE,
  ADMIN_HOTEL_ROLE,
  ADMIN_PLATFORM_ROLE,
} from "../model/user.model.js";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isHotelAdminLogged } from "../middleware/is-logged.js";
import { body, param, query } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controller/user.controller.js";

const router = Router();

router
  .route("/")
  .get(
    [
      validateJwt,
      isHotelAdminLogged,
      query("limit", "Limit must be an integer").optional().isInt(),
      query("page", "Page must be an integer").optional().isInt(),
      validateRequestParams,
    ],
    getAllUsers,
  )
  .post(
    [
      body("email", "Must be a valid Email").isEmail(),
      body(
        "password",
        "Must have at least 6 characters, 1 upper case, and 1 number",
      ).isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      }),
      body(
        "role",
        `Role must be defined, must be one of these: ${CLIENT_ROLE}, ${ADMIN_HOTEL_ROLE}, ${ADMIN_PLATFORM_ROLE}`,
      ).isIn([ADMIN_HOTEL_ROLE, CLIENT_ROLE]),
      validateRequestParams,
    ],
    createUser,
  );

router
  .route("/:id")
  .get(
    [
      validateJwt,
      isHotelAdminLogged,
      param("id", "The ID must be a valid MongoID").isMongoId(),
      validateRequestParams,
    ],
    getUserById,
  )
  .put(
    [
      validateJwt,
      isHotelAdminLogged,
      body("email", "If defined, email must be a valid email")
        .optional()
        .isEmail(),
      body(
        "password",
        "If defined, must have at least 6 characters, 1 upper case, and 1 number",
      )
        .optional()
        .isStrongPassword({
          minLength: 6,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        }),
      body(
        "role",
        `If defined, role must be defined, must be one of these: ${CLIENT_ROLE}, ${ADMIN_HOTEL_ROLE}, ${ADMIN_PLATFORM_ROLE}`,
      )
        .optional()
        .isIn([ADMIN_HOTEL_ROLE, CLIENT_ROLE]),
      validateRequestParams,
    ],
    updateUserById,
  )
  .delete(
    [
      validateJwt,
      isHotelAdminLogged,
      param("id", "The ID must be a valid MongoID").isMongoId(),
      validateRequestParams,
    ],
    deleteUserById,
  );

export default router;
