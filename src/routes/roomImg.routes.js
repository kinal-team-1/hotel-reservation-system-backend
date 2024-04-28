import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  roomImagePost,
  roomImagesGet,
  roomImageDelete
} from "../controller/roomImg.controller.js";

const router = Router();

router.get(
  "/",
  [
    validateJwt,
    isAdminLogged,
    query("room_id", "if `room_id` is defined, it must be a valid MongoId")
      .optional()
      .isMongoId(),
    validateRequestParams
  ],
  roomImagesGet
);

router.post(
  "/",
  [
    validateJwt,
    isAdminLogged,
    body(
      "image_url",
      "The field `image_url` is required and must be a valid URL"
    )
      .not()
      .isEmpty(),
    body(
      "room_id",
      "The field `room_id` is required and must be a valid MongoId"
    ).isMongoId(),
    body(
      "is_main_image",
      "The field `is_main_image` is required and must be a boolean"
    ).isBoolean(),
    validateRequestParams
  ],
  roomImagePost
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams
  ],
  roomImageDelete
);

export default router;
