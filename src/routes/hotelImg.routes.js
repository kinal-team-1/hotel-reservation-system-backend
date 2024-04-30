import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isHotelAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  hotelImagePost,
  hotelImagesGet,
  getHotelImageById,
  hotelImageDelete,
  changeMainImage,
} from "../controller/hotelImg.controller.js";

const router = Router();

router.get(
  "/",
  [
    validateJwt,
    isHotelAdminLogged,
    query("hotel_id", "El hotel_id no es un ObjectId válido")
      .optional()
      .isMongoId(),
    validateRequestParams,
  ],
  hotelImagesGet,
);

router.get(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  getHotelImageById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    body("is_main_image")
      .isBoolean()
      .withMessage(
        "The field `is_main_image` is required and must be a boolean",
      ),
    validateRequestParams,
  ],
  changeMainImage,
);

router.post(
  "/",
  [
    validateJwt,
    isHotelAdminLogged,
    body("image_url", "La URL de la imagen es requerida").not().isEmpty(),
    body("hotel_id", "El ID del hotel es requerido").isMongoId(),
    body(
      "is_main_image",
      "El valor de is_main_image debe ser un booleano",
    ).isBoolean(),
    validateRequestParams,
  ],
  hotelImagePost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  hotelImageDelete,
);

export default router;
