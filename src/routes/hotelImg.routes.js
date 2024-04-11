import { Router } from "express";
import { body, param } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  putHotelImage,
  hotelImagePost,
  hotelImagesGet,
  getHotelImageById,
  hotelImageDelete,
} from "../controller/hotelImg.controller.js";

const router = Router();

router.get("/", [validateJwt, isAdminLogged], hotelImagesGet);

router.get(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    param("id").isMongoId(),
    validateRequestParams,
  ],
  getHotelImageById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    param("id").isMongoId(),
    validateRequestParams,
  ],
  putHotelImage,
);

router.post(
  "/",
  [
    validateJwt,
    isAdminLogged,
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
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    param("id").isMongoId(),
    validateRequestParams,
  ],
  hotelImageDelete,
);

export default router;
