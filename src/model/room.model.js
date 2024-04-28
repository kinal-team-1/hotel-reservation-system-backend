import { Schema, model } from "moongose";

const roomSchema = new Schema({
  description: {
    type: String,
    required: [true, "The `description` is required"],
  },
  people_capacity: {
    type: Number,
    required: [true, "The `people_capacity` is required"],
    integer: true,
  },
  night_price: {
    type: Number,
    required: [true, "The `night_price` is required"],
    double: true,
  },
  room_type: {
    type: String,
    required: [true, ""],
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

const roomModel = model("Room", roomSchema);

export default roomModel;
