import { Router } from "express";
import { body, param } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  putHotel,
  hotelPost,
  hotelsGet,
  getHotelById,
  hotelDelete,
} from "../controller/hoteles.controller.js";

const router = Router();

router.get("/", [validateJwt, isAdminLogged], hotelsGet);

router.get(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    param("id").isMongoId(),
    validateRequestParams,
  ],
  getHotelById,
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
  putHotel,
);

router.post(
  "/",
  [
    validateJwt,
    isAdminLogged,
    body("name", "El nombre no puede estar vacío").not().isEmpty(),
    body("country", "El país es obligatorio").not().isEmpty(),
    body("address", "La dirección es obligatoria").not().isEmpty(),
    body("description", "La descripción es obligatoria").not().isEmpty(),
    validateRequestParams,
  ],
  hotelPost,
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
  hotelDelete,
);

export default router;
