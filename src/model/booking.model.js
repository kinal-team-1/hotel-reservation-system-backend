import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  date_start: {
    type: Date,
    required: [true, "The `date_start` is required"],
  },
  date_end: {
    type: Date,
    required: [true, "The `date_end` is required"],
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
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "The `room` ID is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The `user` ID is required"],
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
});

const bookingModel = model("Booking", bookingSchema);

export default bookingModel;
