import Invoice from "../model/invoice.model.js";
import Service from "../model/services.model.js";
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
    query("limit").optional().isNumeric().withMessage("`limit` must be an int"),
    query("page").optional().isNumeric().withMessage("`page` must be an int"),
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
    body("transaction_id", "El ID de transacción es requerido")
      .isMongoId()
      .custom(async (value) => {
        const transaction = await Invoice.findById(value);
        if (!transaction) throw new Error("Invoice not found");
      }),
    body("services_id", "El ID de servicios es requerido")
      .isMongoId()
      .custom(async (value) => {
        const service = await Service.findById(value);
        if (!service) throw new Error("Service not found");
      }),
    body("quantity", "La cantidad es requerida").isInt(),
    body("date_acquired", "La fecha de adquisición es requerida").isISO8601(),
    body("date_start", "La fecha de inicio es requerida").isISO8601(),
    body("date_end", "La fecha de fin es requerida").isISO8601(),
    body("total_price", "El precio total es requerido").isNumeric(),
    validateRequestParams,
  ],
  createServicesAcquired,
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID debe ser un MongoID valido"),
    body("transaction_id", "El ID de transacción debe ser un MongoID")
      .optional()
      .isMongoId()
      .custom(async (value) => {
        const transaction = await Invoice.findById(value);
        if (!transaction) throw new Error("Invoice not found");
      }),
    body("services_id", "Se necesita el id de un servicio activo")
      .optional()
      .isMongoId()
      .custom(async (value) => {
        const service = await Service.findById(value);
        if (!service) throw new Error("Service not found");
      }),
    body("quantity", "La cantidad es requerida").optional().isInt(),
    body("date_acquired", "La fecha de adquisición es requerida")
      .optional()
      .isISO8601(),
    body("date_start", "La fecha de inicio es requerida")
      .optional()
      .isISO8601(),
    body("date_end", "La fecha de fin es requerida").optional().isISO8601(),
    body("total_price", "El precio total debe ser un numero")
      .optional()
      .isISO8601(),
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
