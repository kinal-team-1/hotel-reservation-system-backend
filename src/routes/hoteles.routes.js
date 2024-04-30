import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isHotelAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  putHotel,
  hotelPost,
  hotelsGet,
  getHotelById,
  hotelDelete,
} from "../controller/hoteles.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limit").optional().isInt().withMessage("`limit` must be an Int"),
    query("page").optional().isInt().withMessage("`limit` must be an Int"),
    validateRequestParams,
  ],
  hotelsGet,
);

router.get(
  "/:id",
  [
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  getHotelById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id").isMongoId(),
    body("name", "If `name` is provided, must be at least 4 characters long")
      .optional()
      .isLength({ min: 4 }),
    body(
      "country",
      "If `country` is provided, must be at least 3 characters long",
    )
      .optional()
      .isLength({ min: 3 }),
    body(
      "address",
      "If `address` is provided, must be at least 10 characters long",
    )
      .optional()
      .isLength({ min: 10 }),
    body(
      "description",
      "If `description` is provided, must be at least 30 characters long",
    )
      .optional()
      .isLength({ min: 30 }),
    validateRequestParams,
  ],
  putHotel,
);

router.post(
  "/",
  [
    validateJwt,
    isHotelAdminLogged,
    body(
      "name",
      "`name` is required and must be at least 4 characters long",
    ).isLength({ min: 4 }),
    body(
      "country",
      "The field `country` is required and must be at least 3 characters long",
    ).isLength({
      min: 3,
    }),
    body(
      "address",
      "The field `address` is required and must be at least 10 characters long",
    ).isLength({ min: 10 }),
    body(
      "description",
      "The field `description` is required and must be at least 30 characters long",
    ).isLength({ min: 30 }),
    validateRequestParams,
  ],
  hotelPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  hotelDelete,
);

export default router;
