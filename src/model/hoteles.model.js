import { Schema, model } from "mongoose";

const hotelSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  country: {
    type: String,
    required: [true, "El país es requerido"],
  },
  address: {
    type: String,
    required: [true, "La dirección es requerida"],
  },
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
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

const hotelModel = model("Hotel", hotelSchema);

export default hotelModel;
