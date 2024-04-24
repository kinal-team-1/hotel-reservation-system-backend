import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  reviewsGet,
  getReviewById,
  putReview,
  reviewDelete,
  reviewPost,
} from "../controller/reviews.controller.js";

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
  reviewsGet
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
  getReviewById
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id").isMongoId(),
    body("comment", "El comentario no puede estar vacío").notEmpty(),
    body("rating_cleanliness", "La calificación de limpieza es requerida").isNumeric(),
    body("rating_staff", "La calificación del personal es requerida").isNumeric(),
    body("rating_facilities", "La calificación de las instalaciones es requerida").isNumeric(),
    body("tp_status", "El estado es requerido").notEmpty().isIn(["ACTIVE", "INACTIVE"]),
    body("is_custom", "Se requiere indicar si es personalizado").isBoolean(),
    body("user_id", "El ID de usuario es requerido").notEmpty(),
    body("hotel_id", "El ID del hotel es requerido").notEmpty(),
    validateRequestParams,
  ],
  putReview
);

router.post(
  "/",
  [
    validateJwt,
    body("comment", "El comentario es requerido").notEmpty(),
    body("rating_cleanliness", "La calificación de limpieza es requerida").isNumeric(),
    body("rating_staff", "La calificación del personal es requerida").isNumeric(),
    body("rating_facilities", "La calificación de las instalaciones es requerida").isNumeric(),
    body("tp_status", "El estado es requerido").notEmpty().isIn(["ACTIVE", "INACTIVE"]),
    body("is_custom", "Se requiere indicar si es personalizado").isBoolean(),
    body("user_id", "El ID de usuario es requerido").notEmpty(),
    body("hotel_id", "El ID del hotel es requerido").notEmpty(),
    validateRequestParams,
  ],
  reviewPost
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    validateRequestParams,
  ],
  reviewDelete
);

export default router;
