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
      .withMessage("Limit must be a numeric value"),
    query("page") 
      .optional()
      .isNumeric()
      .withMessage("Page must be a numeric value"),
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
    body("date_start", "If defined, start date must be defined as YYYY-MM-DD").optional().custom((date) => {
      if (typeof date !== "string") throw new Error("Date must be a string");
      if (date.split("-").length !== 3) throw new Error("Date not valid");
      const [year, month, day] = date.split("-");
      const isValidDate = Date.validate(year, month, day); 
      if (!isValidDate) throw new Error("Date not valid");
      return true;
    }),
    body("date_end", "If defined, end date must be defined as YYYY-MM-DD").optional().custom((date) => {
      if (typeof date !== "string") throw new Error("Date must be a string");
      if (date.split("-").length !== 3) throw new Error("Date not valid");
      const [year, month, day] = date.split("-");
      const isValidDate = Date.validate(year, month, day); 
      if (!isValidDate) throw new Error("Date not valid");
      return true;
    }),
    body("tp_status").isEmpty().withMessage("tp_status is not allowed"), 
    validateRequestParams,
  ],
  putBooking,
);


router.post(
  "/",
  [
    validateJwt,
    body("date_start", "Start date is required").notEmpty().isISO8601().toDate(),
    body("date_end", "End date is required").notEmpty().isISO8601().toDate(),
    body("tp_status").isEmpty().withMessage("tp_status is not allowed"),
    body("room", "Room ID is required").notEmpty().isMongoId(),
    body("user", "User ID is required").notEmpty().isMongoId(), 
    validateRequestParams,
  ],
  bookingPost,
);


router.delete(
  "/:id",
  [
    validateJwt,
    param("id", "Invalid ID").isMongoId(),
    validateRequestParams,
  ],
  bookingDelete,
);

export default router;
