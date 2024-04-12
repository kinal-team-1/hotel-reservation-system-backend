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
} from "../controller/rooms.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limite")
      .optional()
      .isNumeric()
      .withMessage("El límite debe ser un valor numérico"),
    query("desde")
      .optional()
      .isNumeric()
      .withMessage("El valor desde debe ser numérico"),
    validateRequestParams,
  ],
  roomsGet,
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
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
      "La actualización de la descripción de la habitación no puede estar vacía",
    )
      .optional()
      .isLength({ min: 4 }),
    body(
      "people_capacity",
      "La capacidad de personas debe ser un número entero",
    )
      .optional()
      .isInt(),
    body("night_price", "El precio por noche debe ser un número válido")
      .optional()
      .isNumeric(),
    body("tipo_habitacion", "El tipo de habitación es requerido")
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
      "La descripción de la habitación es requerida y debe tener al menos 4 caracteres",
    ).isLength({ min: 4 }),
    body("people_capacity", "La capacidad de personas es requerida").isInt(),
    body("night_price", "El precio por noche es requerido").isNumeric(),
    body("tipo_habitacion", "El tipo de habitación es requerido").notEmpty(),
    validateRequestParams,
  ],
  roomPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    validateRequestParams,
  ],
  roomDelete,
);

export default router;
