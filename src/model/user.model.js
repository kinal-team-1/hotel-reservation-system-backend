import { model, Schema } from "mongoose";

// Definir los roles
const [ADMIN_ROLE, CLIENT_ROLE] = ["ADMIN_ROLE", "CLIENT_ROLE"];

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
    enum: [ADMIN_ROLE, CLIENT_ROLE],
    required: true,
  },
  tp_status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    required: true,
    default: "ACTIVE",
  },
});

// Índice en el campo de correo electrónico
UserSchema.index({ email: 1 });

// Crear el modelo de usuario
const UserModel = model("User", UserSchema);

export default UserModel;
