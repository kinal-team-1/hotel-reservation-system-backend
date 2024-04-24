import { Schema, model } from "mongoose";

const favoriteHotelSchema = new Schema({
  user_id: {
    ref:"User",
    required: [true, "El ID de usuario es requerido"],
  },
  hotel_id: {
    ref:"Hotel",
    required: [true, "El ID del hotel es requerido"],
  },
});

const favUserHotel = model("favoriteUserHotel", favoriteHotelSchema);

export default favUserHotel;