import { Schema, model } from "moongose";

const habitacionSchema = new Schema({
  description: {
    type: String,
    required: [true, "la descripcion es requerida"],
  },
  people_capacity: {
    type: Number,
    required: [true, "La capacidad de personas es requerida"],
    integer: true,
  },
  night_price: {
    type: Number,
    required: [true, "El precio por noche es requerido"],
    double: true,
  },
  tipo_habitacion: {
    type: String,
    required: [true, "El tipo de habitacion es requerido"],
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

const habitacionModel = model("Habitacion", habitacionSchema);

export default habitacionModel;
