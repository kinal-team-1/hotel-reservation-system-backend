import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";

import {
  reviewsGet,
  getReviewById,
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
  reviewsGet
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
  getReviewById
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id").isMongoId(),
    body("comment").optional().notEmpty().withMessage("Comment cannot be empty"),
    body("rating_cleanliness").optional().isNumeric().withMessage("Cleanliness rating is required"),
    body("rating_staff").optional().isNumeric().withMessage("Staff rating is required"),
    body("rating_facilities").optional().isNumeric().withMessage("Facilities rating is required"),
    body("tp_status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is required"),
    body("is_customer").optional().isBoolean().withMessage("Specify whether it is custom"),
    body("user_id").optional().notEmpty().withMessage("User ID is required"),
    body("hotel_id").optional().notEmpty().withMessage("Hotel ID is required"),
    
    validateRequestParams,
  ],
  putReview
);


router.post(
  "/",
  [
    validateJwt,
    body("comment", "Comment is required").notEmpty(),
    body("rating_cleanliness", "Rating cleanliness must be a number").isNumeric(),
    body("rating_staff", "Rating staff must be a number").isNumeric(),
    body("rating_facilities", "Rating facilities must be a number").isNumeric(),
    body("tp_status", "Status is required").notEmpty().isIn(["ACTIVE", "INACTIVE"]),
    body("is_custom", "Indicate whether it's custom or not").isBoolean(),
    body("user_id", "User ID is required").notEmpty().isMongoId(),
    body("hotel_id", "Hotel ID is required").notEmpty().isMongoId(),
    validateRequestParams,
  ],
  reviewPost
);


router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "It is not a valid id").isMongoId(),
    validateRequestParams,
  ],
  reviewDelete
);

export default router;
