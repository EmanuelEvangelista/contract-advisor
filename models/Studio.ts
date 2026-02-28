import { Schema, model, models, Model } from "mongoose";

export interface IStudio {
  name: string;
  invitationCode: string;
  adminEmail: string;
  settings: {
    logoUrl: string;
    plan: string;
  };
}

const studioSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del estudio es obligatorio"],
      trim: true,
    },
    // Este es el código que la contadora compartirá con sus empleados
    invitationCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true, // Siempre en mayúsculas para evitar errores al escribir
    },
    // Email del creador (Contadora/Administrador del estudio)
    adminEmail: {
      type: String,
      required: true,
    },
    // Podrías agregar campos adicionales como logo, dirección, etc.
    settings: {
      logoUrl: { type: String, default: null },
      plan: { type: String, enum: ["free", "premium"], default: "free" },
    },
  },
  {
    timestamps: true, // Para saber cuándo se creó el estudio
  },
);

// Verificamos si el modelo ya existe para evitar errores en el Hot Reload de Next.js
const Studio =
  (models.Studio as Model<IStudio>) || model<IStudio>("Studio", studioSchema);

export default Studio;
