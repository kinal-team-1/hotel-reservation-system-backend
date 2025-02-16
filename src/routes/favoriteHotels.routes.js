import User from "../model/user.model.js";
import Hotel from "../model/hoteles.model.js";
import { Router } from "express";
import { query, body } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  favoritesGet,
  favoriteDelete,
  favoritePost,
} from "../controller/favoriteHotel.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("The limit must be a numerical value"),
    query("page")
      .optional()
      .isNumeric()
      .withMessage("The value from must be numeric"),
    validateRequestParams,
  ],
  favoritesGet,
);

router.post(
  "/",
  [
    validateJwt,
    body("user", "User ID is required")
      .notEmpty()
      .isMongoId()
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) throw new Error("User not found");
      }),
    body("hotel", "Hotel ID is required")
      .notEmpty()
      .isMongoId()
      .custom(async (value) => {
        const hotel = await Hotel.findById(value);
        if (!hotel) throw new Error("Hotel not found");
      }),
    validateRequestParams,
  ],
  favoritePost,
);

router.delete(
  "/",
  [
    validateJwt,
    body("user", "User ID is required")
      .notEmpty()
      .isMongoId()
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) throw new Error("User not found");
      }),
    body("hotel", "Hotel ID is required")
      .notEmpty()
      .isMongoId()
      .custom(async (value) => {
        const hotel = await Hotel.findById(value);
        if (!hotel) throw new Error("Hotel not found");
      }),
    validateRequestParams,
  ],
  favoriteDelete,
);

export default router;
