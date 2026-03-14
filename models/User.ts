import { Schema, model, models, Model } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  password?: string; // 👈 Agregado para el login de Pedro y Juan
  image?: string;
  role: string;
  studioId: string | null; // Simplificado a string para que coincida con el Schema
  status: string;
  employeeId: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      // 👈 Agregado al Schema
      type: String,
      required: false, // Opcional porque Google no lo usa
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["accountant", "employee"],
    },
    studioId: {
      type: String,
      ref: "Studio",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    employeeId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default User;
