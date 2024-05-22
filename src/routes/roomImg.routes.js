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
  roomImagesPost,
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
  "/multiple",
  [
    validateJwt,
    isHotelAdminLogged,
    body("images", "Images array is required").isArray(),
    body("images.*.image_url", "Image URL is required for each image")
      .not()
      .isEmpty(),
    body(
      "room_id",
      "The field `room_id` is required and must be a valid MongoId",
    ).isMongoId(),
    body(
      "images.*.is_main_image",
      "is_main_image must be a boolean for each image",
    ).isBoolean(),
    body("images").custom((images) => {
      const mainImages = images.filter((image) => image.is_main_image);
      if (mainImages.length !== 1) {
        throw new Error(
          "Exactly one image must have is_main_image set to true",
        );
      }
      return true;
    }),
    validateRequestParams
  ],
  roomImagesPost
)

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
