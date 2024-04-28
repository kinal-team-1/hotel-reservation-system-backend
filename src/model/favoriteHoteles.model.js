import mongoose from "mongoose";

const { Schema } = mongoose;

const favoriteHotelSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Hotel ID is required"],
  },
});

favoriteHotelSchema.index({ user: 1, hotel: 1 }, { unique: true });

const FavoriteHotel = mongoose.model("FavoriteHotel", favoriteHotelSchema);

export default FavoriteHotel;
