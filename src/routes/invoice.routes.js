import { Router } from "express";
import { body, param } from "express-validator";
//import { validateJwt } from "../middleware/validate-jwt.js";
//import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controller/invoice.controller.js";

const router = Router();

// Obtener todas las facturas
router.get(
  "/",
  [
    //        validateJwt,
    //        isAdminLogged
  ],
  getInvoices,
);

// Obtener una factura por su ID
router.get(
  "/:id",
  [
    //        validateJwt,
    //        isAdminLogged,
    param("id").isMongoId(),
  ],
  getInvoiceById,
);

// Crear una nueva factura
router.post(
  "/",
  [
    //  validateJwt,
    //  isAdminLogged,
    body("id", "Invoice ID is required").notEmpty(),
    body("price", "Invoice price is required").notEmpty().isNumeric().toFloat(),
    body("booking", "Booking ID is required").notEmpty().isMongoId(),
    body("user", "User ID is required").notEmpty().isMongoId(),
    validateRequestParams,
  ],
  createInvoice,
);

// Actualizar una factura por su ID
router.put(
  "/:id",
  [
    //  validateJwt,
    //  isAdminLogged,
    body("price", "Price must be a non-negative number")
      .optional()
      .isFloat({ min: 0 }),
    body("tp_status", "Invoice status must be at least 5 characters long")
      .optional()
      .isLength({ min: 5 }),
    body("booking", "Booking ID must be a valid MongoDB ID")
      .optional()
      .isMongoId(),
    body("user", "User ID must be a valid MongoDB ID").optional().isMongoId(),
    validateRequestParams,
  ],
  updateInvoice,
);

// Eliminar una factura por su ID
router.delete(
  "/:id",
  [
    //        validateJwt,
    //        isAdminLogged,
    param("id").isMongoId(),
  ],
  deleteInvoice,
);

export default router;
