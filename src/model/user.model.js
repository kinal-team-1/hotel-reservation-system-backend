import { model, Schema } from "mongoose";

// Definir los roles
export const [ADMIN_HOTEL_ROLE, CLIENT_ROLE, ADMIN_PLATFORM_ROLE] = [
  "ADMIN_HOTEL_ROLE",
  "CLIENT_ROLE",
  "ADMIN_PLATFORM_ROLE",
];

// Definir el esquema del usuario
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  role: {
    type: String,
    enum: [ADMIN_HOTEL_ROLE, CLIENT_ROLE, ADMIN_PLATFORM_ROLE],
    required: true,
  },
  tp_status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    required: true,
    default: "ACTIVE",
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

// Índice en el campo de correo electrónico
UserSchema.index({ email: 1 });

// Crear el modelo de usuario
const UserModel = model("User", UserSchema);

export default UserModel;
