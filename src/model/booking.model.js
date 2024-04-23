import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  date_start: {
    type: Date,
    required: [true, "La fecha de inicio es requerida"],
  },
  date_end: {
    type: Date,
    required: [true, "La fecha de fin es requerida"],
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, "La fecha de creación es requerida"],
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  tp_status: {
    type: String,
    required: [true, "El estado del hotel es requerido"],
    enum: ["ACTIVE", "INACTIVE"],
  },
});

const bookingModel = model("Booking", bookingSchema);

export default bookingModel;
