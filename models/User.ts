import { Schema, model, models, Model } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  password?: string;
  image?: string;
  role: string | null;
  studioId: string | null;
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
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["accountant", "employee"],
      default: null,
    },
    studioId: {
      type: String || null,
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
