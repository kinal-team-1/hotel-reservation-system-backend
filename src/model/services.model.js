import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
  },
  tp_status: {
    type: String,
    required: [true, "El estado del hotel es requerido"],
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
  duration: {
    type: Date,
    required: [true, "La duración es requerida"],
  },
  price: {
    type: Number,
  },
  hotel_id: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "El ID del hotel es requerido"],
  },
});

const serviceModel = model("Service", serviceSchema);

export default serviceModel;
