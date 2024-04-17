import { Schema, model } from "mongoose";

const roomImageSchema = new Schema({
  image_url: {
    type: String,
    required: [true, "La URL es necesaria"],
  },
  room_id: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "El ID es necesario"],
  },
  is_main_image: {
    type: Boolean,
    default: false,
  },
});

roomImageSchema.index({ room_id: 1 });

const roomImage = model("roomImage", roomImageSchema);

export default roomImage;
