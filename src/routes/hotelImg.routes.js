import Hotel from "../model/hoteles.model.js";
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
  getHotelImageByHotel,
  hotelImagesPost,
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

router.get(
  "/by-hotel/:hotelId",
  [
    validateJwt,
    isHotelAdminLogged,
    param("hotelId", "The ID must be a valid MongoID")
      .isMongoId()
      .custom(async (value) => {
        const hotel = await Hotel.findById(value);
        if (!hotel) throw new Error("Hotel not found");
      }),
    validateRequestParams,
  ],
  getHotelImageByHotel,
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
  "/multiple",
  [
    validateJwt,
    isHotelAdminLogged,
    body("images", "Images array is required").isArray(),
    body("images.*.image_url", "Image URL is required for each image")
      .not()
      .isEmpty(),
    body(
      "images.*.hotel_id",
      "Hotel ID is required for each image",
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
    validateRequestParams,
  ],
  hotelImagesPost, // This should be your new controller function that handles an array of images
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
