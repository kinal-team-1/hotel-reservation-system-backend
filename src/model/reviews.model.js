import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  rating_cleanliness: {
    type: Number,
    required: [true, "Cleanliness rating is required"],
  },
  rating_staff: {
    type: Number,
    required: [true, "Staff rating is required"],
  },
  rating_facilities: {
    type: Number,
    required: [true, "Facilities rating is required"],
  },
  tp_status: {
    type: String,
    required: [true, "Status is required"],
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
  is_customer: {
    type: Boolean,
    required: [true, "Specify whether it was a customer"],
  },
  user_id: {
    type: String,
    required: [true, "User ID is required"],
  },
  hotel_id: {
    type: String,
    required: [true, "Hotel ID is required"],
  },
});

const Review = model("Review", reviewSchema);

export default Review;
