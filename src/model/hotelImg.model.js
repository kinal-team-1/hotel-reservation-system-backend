import { Schema, model } from "mongoose";

const hotelImageSchema = new Schema({
  image_url: {
    type: String,
    required: [true, "the `image_url` is required"]
  },
  hotel_id: {
    type: Schema.Types.ObjectId,
    ref: "Hotel", // Referencia al modelo de Hotel
    required: [true, "The `hotel_id` is required"]
  },
  is_main_image: {
    type: Boolean,
    default: false
  }
});

hotelImageSchema.index({ hotel_id: 1 });

const hotelImage = model("HotelImage", hotelImageSchema);

export default hotelImage;
