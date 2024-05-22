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
  getBookingsByRoom,
  getBookingsByUser,
  getUnavailableDates,
  getBookingsByHotel,
} from "../controller/booking.controller.js";
import User from "../model/user.model.js";
import Room from "../model/room.model.js";
import Hotel from "../model/hoteles.model.js";

const router = Router();

router.get(
  "/",
  [
    query("limit").optional().isNumeric().withMessage("`limit` must be an int"),
    query("page").optional().isNumeric().withMessage("`page` must be an int"),
    validateRequestParams,
  ],
  bookingsGet,
);

router.get(
  "/by-user/:userId",
  [
    param("userId", "The ID must be a valid MongoID")
      .isMongoId()
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) throw new Error("User not found");
      }),
  ],
  getBookingsByUser,
);

router.get("/by-user/:userId/rooms/taken-dates", getUnavailableDates);

router.get(
  "/by-room/:roomId",
  [
    param("roomId")
      .isMongoId()
      .custom(async (value) => {
        const room = await Room.findById(value);
        if (!room) throw new Error("Room not found");
      }),
  ],
  getBookingsByRoom,
);

router.get(
  "/by-hotel/:hotelId",
  [
    param("hotelId", "The ID must be a valid MongoID")
      .isMongoId()
      .custom(async (value) => {
        const hotel = await Hotel.findById(value);
        if (!hotel) throw new Error("Hotel not found");
      }),
  ],
  getBookingsByHotel,
);

router.get(
  "/:id",
  [
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  getBookingById,
);

router.put(
  "/:id",
  [
    validateJwt,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    body("date_start", "If defined, start date must be defined as YYYY-MM-DD")
      .optional()
      .isISO8601(),
    body("date_end", "If defined, end date must be defined as YYYY-MM-DD")
      .optional()
      .isISO8601(),
    body("tp_status").isEmpty().withMessage("tp_status is not allowed"),
    validateRequestParams,
  ],
  putBooking,
);

router.post(
  "/",
  [
    validateJwt,
    body(
      "date_start",
      "The field `date_start` is required and must be a valid date in format YYYY-MM-DD",
    )
      .notEmpty()
      .isISO8601(),
    body(
      "date_end",
      "The field `date_end` is required and must be a valid date in format YYYY-MM-DD",
    )
      .notEmpty()
      .isISO8601(),
    body("tp_status")
      .isEmpty()
      .withMessage("The field `tp_status` is not allowed"),
    body("room", "The field `room` ID is required and must be a MongoID")
      .notEmpty()
      .isMongoId(),
    body("user", "The field `user` ID is required and must be a MongoID")
      .notEmpty()
      .isMongoId(),
    validateRequestParams,
  ],
  bookingPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  bookingDelete,
);

export default router;
