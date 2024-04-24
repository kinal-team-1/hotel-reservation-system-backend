import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: [true, "El comentario es requerido"],
  },
  rating_cleanliness: {
    type: int,
    required: [true, "La calificación de limpieza es requerida"],
  },
  rating_staff: {
    type: int,
    required: [true, "La calificación del personal es requerida"],
  },
  rating_facilities: {
    type: int,
    required: [true, "La calificación de las instalaciones es requerida"],
  },
  tp_status: {
    type: String,
    required: [true, "El estado es requerido"],
    enum: ["ACTIVE", "INACTIVE"],
  },
  is_custom: {
    type: Boolean,
    required: [true, "Se requiere indicar si es personalizado"],
  },
  user_id: {
    type: String,
    required: [true, "El ID de usuario es requerido"],
  },
  hotel_id: {
    type: String,
    required: [true, "El ID del hotel es requerido"],
  }
});

const Review = model("Review", reviewSchema);

export default Review;
