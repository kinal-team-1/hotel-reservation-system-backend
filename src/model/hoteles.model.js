import { Schema, model } from "mongoose";

const hotelSchema = new Schema({
  name: {
    type: String,
    required: [true, "The `name` is required"],
  },
  country: {
    type: String,
    required: [true, "The `country` is required"],
  },
  address: {
    type: String,
    required: [true, "The `address` is required"],
  },
  description: {
    type: String,
    required: [true, "The `description` is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, "The `created_at` is required"],
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  tp_status: {
    type: String,
    required: [true, "The `tp_status` is required"],
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: [],
    },
  ],
  user_admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The `user_admin` is required"],
  },
});

const hotelModel = model("Hotel", hotelSchema);

export default hotelModel;
