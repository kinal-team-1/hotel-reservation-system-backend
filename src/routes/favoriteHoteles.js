import { Router } from "express";
import { param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  favoritesGet,
  getFavoriteById,
  putFavorite,
  favoriteDelete,
  favoritePost,
} from "../controller/favoriteHotel.controller.js";

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
  favoritesGet
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
  getFavoriteById
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id").isMongoId(),
    validateRequestParams,
  ],
  putFavorite
);

router.post(
  "/",
  [
    validateJwt,
    param("user_id").notEmpty().withMessage("El ID de usuario es requerido"),
    param("hotel_id").notEmpty().withMessage("El ID del hotel es requerido"),
    validateRequestParams,
  ],
  favoritePost
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    validateRequestParams,
  ],
  favoriteDelete
);

export default router;
