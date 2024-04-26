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
    body("id", "El ID de la factura es requerido").notEmpty(),
    body("price", "El precio de la factura es requerido").notEmpty(),
    body("booking_id", "El ID de la reserva es requerido").notEmpty(),
    body("user_id", "El ID de usuario es requerido").notEmpty(),
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
    body("price", "El precio es un campo que no puede estar vacio")
      .optional()
      .isLength({ min: 2 }),
    body("tp_status", "El estado de la factura no es obligatorio")
      .optional()
      .isLength({ min: 5 }),
    body(
      "booking_id",
      "El ID de la reserva es requerido en forma numerica ejemplo: 1=booking_id",
    ).optional(),
    body(
      "user_id",
      "El ID de usuario es necesria para buscarlo de forma mas presisa",
    ).optional(),
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
