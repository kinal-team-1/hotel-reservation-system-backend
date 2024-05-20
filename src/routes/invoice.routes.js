import Booking from "../model/booking.model.js";
import User from "../model/user.model.js";
import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import { validateJwt } from "../middleware/validate-jwt.js";
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
    validateJwt,
    query("limit").optional().isNumeric().withMessage("`limit` must be an int"),
    query("page").optional().isNumeric().withMessage("`page` must be an int"),
    validateRequestParams,
  ],
  getInvoices,
);

// Obtener una factura por su ID
router.get(
  "/:id",
  [
    validateJwt,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  getInvoiceById,
);

// Crear una nueva factura
router.post(
  "/",
  [
    validateJwt,
    body("price", "El precio de la factura es requerido")
      .isLength({ min: 2 })
      .isNumeric(),
    body("booking_id", "El ID de la reserva es requerido")
      .isMongoId()
      .custom(async (value) => {
        const booking = Booking.findById(value);
        if (!booking) throw new Error("Booking is not found");
      }),
    body("user_id", "El ID de usuario es requerido")
      .isMongoId()
      .custom(async (value) => {
        const user = User.findById(value);
        if (!user) throw new Error("User is not found");
      }),
    validateRequestParams,
  ],
  createInvoice,
);

// Actualizar una factura por su ID
router.put(
  "/:id",
  [
    validateJwt,
    body("price", "El precio es un campo que no puede estar vacio")
      .optional()
      .isLength({ min: 2 })
      .isNumeric(),
    body(
      "booking_id",
      "The field `booking_id` if provided, must be a valid MongoID",
    )
      .optional()
      .isMongoId()
      .custom(async (value) => {
        const booking = Booking.findById(value);
        if (!booking) throw new Error("Booking is not found");
      }),
    body("user_id", "The field `user_id` if provided, must be a valid MongoID")
      .optional()
      .isMongoId()
      .custom(async (value) => {
        const user = User.findById(value);
        if (!user) throw new Error("User is not found");
      }),
    validateRequestParams,
  ],
  updateInvoice,
);

// Eliminar una factura por su ID
router.delete(
  "/:id",
  [
    validateJwt,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  deleteInvoice,
);

export default router;
