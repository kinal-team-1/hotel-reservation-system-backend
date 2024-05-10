import { Schema, model } from "mongoose";

const servicesAcquiredSchema = new Schema({
  transaction: {
    type: String, // o Schema.Types.ObjectId según tu necesidad
    required: [true, "El ID de la transacción es requerido"],
  },
  services: {
    type: Schema.Types.ObjectId,
    required: [true, "El ID del servicio es requerido"],
  },
  quantity: {
    type: Number,
    required: [true, "La cantidad es requerida"],
  },
  date_acquired: {
    type: Date,
    required: [true, "La fecha de adquisición es requerida"],
  },
  date_start: {
    type: Date,
    required: [true, "La fecha de inicio es requerida"],
  },
  date_end: {
    type: Date,
    required: [true, "La fecha de finalización es requerida"],
  },
  total_price: {
    type: Number,
    required: [true, "El precio total es requerido"],
  },
});

const servicesAcquiredModel = model(
  "Services_Acquired",
  servicesAcquiredSchema,
);

export default servicesAcquiredModel;
