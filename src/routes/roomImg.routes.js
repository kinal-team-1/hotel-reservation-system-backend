import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  putRoomImage,
  roomImagePost,
  roomImagesGet,
  getRoomImageById,
  roomImageDelete,
} from "../controller/roomImg.controller.js";

const router = Router();

router.get(
  "/",
  [
    validateJwt,
    isAdminLogged,
    query("room_id", "El room_id no es un ObjectId válido")
      .optional()
      .isMongoId(),
    validateRequestParams,
  ],
  roomImagesGet,
);

router.get(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    validateRequestParams,
  ],
  getRoomImageById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    body("image_url")
      .optional()
      .not()
      .isEmpty()
      .withMessage("La URL de la imagen no puede estar vacía"),
    body("is_main_image")
      .optional()
      .isBoolean()
      .withMessage("El campo is_main_image debe ser un booleano"),
    validateRequestParams,
  ],
  putRoomImage,
);

router.post(
  "/",
  [
    validateJwt,
    isAdminLogged,
    body("image_url", "La URL de la imagen es requerida").not().isEmpty(),
    body("room_id", "El ID del cuarto es requerido").isMongoId(),
    body(
      "is_main_image",
      "El valor de is_main_image debe ser un booleano",
    ).isBoolean(),
    validateRequestParams,
  ],
  roomImagePost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    validateRequestParams,
  ],
  roomImageDelete,
);

export default router;
