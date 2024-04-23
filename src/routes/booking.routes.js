import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  bookingsGet,
  getBookingById,
  putBooking,
  bookingDelete,
  bookingPost,
} from "../controller/booking.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("El límite debe ser un valor numérico"),
    query("desde")
      .optional()
      .isNumeric()
      .withMessage("El valor desde debe ser numérico"),
    validateRequestParams,
  ],
  bookingsGet,
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
  getBookingById,
);

router.put(
  "/:id",
  [
    validateJwt,
    param("id").isMongoId(),
    body("date_start", "La fecha de inicio es requerida").notEmpty(),
    body("date_end", "La fecha de fin es requerida").notEmpty(),
    body("tp_status", "El estado de la reserva es requerido").notEmpty(),
    validateRequestParams,
  ],
  putBooking,
);

router.post(
  "/",
  [
    validateJwt,
    body("date_start", "La fecha de inicio es requerida").notEmpty(),
    body("date_end", "La fecha de fin es requerida").notEmpty(),
    body("tp_status", "El estado de la reserva es requerido").notEmpty(),
    validateRequestParams,
  ],
  bookingPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    param("id", "No es un id válido").isMongoId(),
    validateRequestParams,
  ],
  bookingDelete,
);

export default router;
