import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  getServicesAcquired,
  getServicesAcquiredById,
  createServicesAcquired,
  updateServicesAcquired,
  deleteServicesAcquired,
} from "../controller/servicesAcquired.controller.js";

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
  getServicesAcquired,
);

router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID debe ser un número"),
    validateRequestParams,
  ],
  getServicesAcquiredById,
);

router.post(
  "/",
  [
    body("transaction_id", "El ID de transacción es requerido").notEmpty(),
    body("services_id", "El ID de servicios es requerido").notEmpty(),
    body("quantity", "La cantidad es requerida").notEmpty(),
    body("date_acquired", "La fecha de adquisición es requerida").notEmpty(),
    body("date_start", "La fecha de inicio es requerida").notEmpty(),
    body("date_end", "La fecha de fin es requerida").notEmpty(),
    body("total_price", "El precio total es requerido").notEmpty(),
    validateRequestParams,
  ],
  createServicesAcquired,
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID debe ser un número"),
    body("transaction_id", "El ID de transacción es requerido").optional(),
    body("services_id", "Se necesita el id de un servicio activo").optional(),
    body("quantity", "La cantidad es requerida").optional(),
    body("date_acquired", "La fecha de adquisición es requerida").notEmpty(),
    body("date_start", "La fecha de inicio es requerida").notEmpty(),
    body("date_end", "La fecha de fin es requerida").notEmpty(),
    body("total_price", "El precio total es requerido").notEmpty(),
    validateRequestParams,
  ],
  updateServicesAcquired,
);

router.delete(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID debe ser un número"),
    validateRequestParams,
  ],
  deleteServicesAcquired,
);

export default router;
