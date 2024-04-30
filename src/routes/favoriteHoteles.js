import { Router } from "express";
import { param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isHotelAdminLogged } from "../middleware/is-logged.js";
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
    param("id").isMongoId(),
    param("user_id", "User ID is required").notEmpty().isMongoId(),
    param("hotel_id", "Hotel ID is required").notEmpty().isMongoId(),
    validateRequestParams,
  ],
  favoritePost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "It is not a valid id").isMongoId(),
    validateRequestParams,
  ],
  favoriteDelete,
);

export default router;
