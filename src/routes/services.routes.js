import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  putService,
  servicePost,
  servicesGet,
  getServiceById,
  serviceDelete,
} from "../controller/services.controller.js";
import validateDuration from "../middleware/validate-duration.js";

const router = Router();

router.get(
  "/",
  [
    query("limit").optional().isNumeric().withMessage("`limit` must be an int"),
    query("page").optional().isNumeric().withMessage("`page` must be an int"),
    validateRequestParams,
  ],
  servicesGet,
);

router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID no es un ObjectId válido"),
    validateRequestParams,
  ],
  getServiceById,
);

router.put(
  "/:id",
  [
    validateJwt,
    param("id").isMongoId().withMessage("El ID no es un ObjectId válido"),
    body("name", "El nombre no puede estar vacío")
      .optional()
      .isLength({ min: 4 }),
    body("description", "La descripción no puede estar vacía")
      .optional()
      .isLength({ min: 10 }),
    body("duration").optional().custom(validateDuration),
    body("price", "El precio debe ser un número válido").optional().isFloat(),
    validateRequestParams,
  ],
  putService,
);

router.post(
  "/",
  [
    validateJwt,
    body("name", "El nombre no puede estar vacío").isLength({ min: 4 }),
    body("description", "La descripción no puede estar vacía").isLength({
      min: 10,
    }),
    body("duration").custom(validateDuration),
    body("price", "El precio debe ser un número válido").isFloat(),
    validateRequestParams,
  ],
  servicePost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    param("id").isMongoId().withMessage("El ID no es un ObjectId válido"),
    validateRequestParams,
  ],
  serviceDelete,
);

export default router;
