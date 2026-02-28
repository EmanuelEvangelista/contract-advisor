import { Schema, model, models, Model } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  name: string;
  image?: string;
  role: string;
  studioId: Schema.Types.ObjectId[];
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
    image: {
      type: String, // Para guardar la foto de perfil de Google
    },
    // --- CAMPOS PARA MULTI-TENANCY ---
    role: {
      type: String,
      enum: ["accountant", "employee"],
      // No ponemos default aquí para obligar al Onboarding a definirlo
    },
    studioId: {
      type: String,
      ref: "Studio",
      default: null, // Se llena en el Onboarding
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending", // Pasa a 'active' cuando termina el Onboarding
    },
    // ID opcional para identificar al empleado internamente en el estudio
    employeeId: {
      type: String,
    },
  },
  {
    timestamps: true, // Nos da createdAt y updatedAt automáticamente
  },
);

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default User;
