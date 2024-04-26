import { Schema, model } from "mongoose";

const invoiceSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  tp_status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    required: true,
  },
  booking_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const invoiceModel = model("Invoice", invoiceSchema);

export default invoiceModel;
