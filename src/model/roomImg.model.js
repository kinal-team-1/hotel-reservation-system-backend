import { Schema, model } from "mongoose";

const roomImageSchema = new Schema({
  image_url: {
    type: String,
    required: [true, "The URL is necessary"]
  },
  room_id: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "The URL is necessary"]
  },
  is_main_image: {
    type: Boolean,
    default: false
  }
});

roomImageSchema.index({ room_id: 1 });

const roomImage = model("RoomImage", roomImageSchema);

export default roomImage;
