import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isHotelAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  roomImagePost,
  roomImagesGet,
  changeMainImage,
  roomImageDelete,
} from "../controller/roomImg.controller.js";

const router = Router();

router.get(
  "/",
  [
    validateJwt,
    isHotelAdminLogged,
    query("room_id", "if `room_id` is defined, it must be a valid MongoId")
      .optional()
      .isMongoId(),
    validateRequestParams,
  ],
  roomImagesGet,
);

router.post(
  "/",
  [
    validateJwt,
    isHotelAdminLogged,
    body(
      "image_url",
      "The field `image_url` is required and must be a valid URL",
    )
      .not()
      .isEmpty(),
    body(
      "room_id",
      "The field `room_id` is required and must be a valid MongoId",
    ).isMongoId(),
    body(
      "is_main_image",
      "The field `is_main_image` is required and must be a boolean",
    ).isBoolean(),
    validateRequestParams,
  ],
  roomImagePost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  roomImageDelete,
);

router.put(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    body(
      "room_id",
      "The field `room_id` is required and must be a valid MongoId",
    ).isMongoId(),
    body(
      "is_main_image",
      "The field `is_main_image` is required and must be a boolean",
    ).isBoolean(),
    validateRequestParams,
  ],
  changeMainImage,
);

export default router;
