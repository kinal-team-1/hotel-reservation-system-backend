import User from "../model/user.model.js";
import Hotel from "../model/hoteles.model.js";
import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isHotelAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  reviewsGet,
  getReviewById,
  getReviewByHotelId,
  putReview,
  reviewDelete,
  reviewPost,
} from "../controller/reviews.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limite")
      .optional()
      .isNumeric()
      .withMessage("The limit must be a numerical value"),
    query("page")
      .optional()
      .isNumeric()
      .withMessage("The value from must be numeric"),
    validateRequestParams,
  ],
  reviewsGet,
);

router.get(
  "/by-hotel/:id",
  [param("id").isMongoId(), validateRequestParams],
  getReviewByHotelId,
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
  getReviewById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id").isMongoId(),
    body("comment")
      .optional()
      .notEmpty()
      .withMessage(
        "If field `comment` is provided, it must be a non-empty string",
      ),
    body("rating_cleanliness")
      .optional()
      .isInt()
      .withMessage(
        "If field `rating_cleanliness` is provided, it must be an int",
      ),
    body("rating_staff")
      .optional()
      .isInt()
      .withMessage("If field `rating_staff` is provided, it must be an int"),
    body("rating_facilities")
      .optional()
      .isInt()
      .withMessage(
        "If field `rating_facilities` is provided, it must be an int",
      ),
    body("is_customer")
      .optional()
      .isBoolean()
      .withMessage("If `is_customer` provided, it must be a boolean value"),
    body("user_id")
      .optional()
      .isMongoId()
      .withMessage("If `user_id` is provided, it must be a MongoID")
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) throw new Error("User not found");
      }),
    body("hotel_id")
      .optional()
      .isMongoId()
      .withMessage("If `user_id` is provided, it must be a MongoID")
      .custom(async (value) => {
        const hotel = await Hotel.findById(value);
        if (!hotel) throw new Error("Hotel not found");
      }),

    validateRequestParams,
  ],
  putReview,
);

router.post(
  "/",
  [
    validateJwt,
    body("comment", "Comment is required").notEmpty(),
    body(
      "rating_cleanliness",
      "The field `rating_cleanliness` is required and must be an int",
    ).isInt(),
    body(
      "rating_staff",
      "The field `rating_staff` is required and must be an int",
    ).isInt(),
    body(
      "rating_facilities",
      "The field `rating_facilities` is required and must be an int",
    ).isInt(),
    body(
      "is_customer",
      "The field `is_customer` should not be provided by the frontend but validated in the backend",
    ).isEmpty(),
    // body("user_id", "The field `user_id` is required and must be a MongoID")
    //   .notEmpty()
    //   .isMongoId()
    //   .custom(async (value) => {
    //     const user = await User.findById(value);
    //     if (!user) throw new Error("User not found");
    //   }),
    body("hotel_id", "The field `hotel_id` is required and must be a MongoID")
      .notEmpty()
      .isMongoId()
      .custom(async (value) => {
        const hotel = await Hotel.findById(value);
        if (!hotel) throw new Error("Hotel not found");
      }),
    validateRequestParams,
  ],
  reviewPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isHotelAdminLogged,
    param("id", "The ID must be a valid MongoID").isMongoId(),
    validateRequestParams,
  ],
  reviewDelete,
);

export default router;
