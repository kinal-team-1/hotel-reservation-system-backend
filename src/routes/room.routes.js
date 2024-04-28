import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  roomsGet,
  getRoomById,
  putRoom,
  roomDelete,
  roomPost,
} from "../controller/room.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limit").optional().isInt().withMessage("`limit` must be an int"),
    query("page").optional().isInt().withMessage("`page` must be an int"),
    validateRequestParams,
  ],
  roomsGet,
);

router.get(
  "/:id",
  [
    param("id", "`id` is required and must be a MongoID").isMongoId(),
    validateRequestParams,
  ],
  getRoomById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id").isMongoId(),
    body(
      "description",
      "If description is provided, it must have at least 4 characters",
    )
      .optional()
      .isLength({ min: 4 }),
    body(
      "people_capacity",
      "If people_capacity is provided, it must be a valid number",
    )
      .optional()
      .isInt(),
    body("night_price", "If night_price is provided, it must be a valid number")
      .optional()
      .isNumeric(),
    body("room_type", "If room_type is provided, it must be a valid string")
      .optional()
      .notEmpty(),
    validateRequestParams,
  ],
  putRoom,
);

router.post(
  "/",
  [
    validateJwt,
    isAdminLogged,
    body(
      "description",
      "`description` is required and must have at least 4 characters",
    ).isLength({ min: 4 }),
    body(
      "people_capacity",
      "`people_capacity` is required and must be an Int",
    ).isInt(),
    body(
      "night_price",
      "`night_price` is required and must be a number",
    ).isNumeric(),
    body("room_type", "`room_type` is required").notEmpty(),
    validateRequestParams,
  ],
  roomPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "`id` is required and must be a MongoID").isMongoId(),
    validateRequestParams,
  ],
  roomDelete,
);

export default router;
