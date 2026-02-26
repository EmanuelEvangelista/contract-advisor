import { Schema, model, models, InferSchemaType } from "mongoose";

const contractSchema = new Schema(
  {
    owner: {
      type: String,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
    contractName: {
      type: String,
      required: [true, "Contract name is required"],
    },
    contractType: {
      type: String,
      required: [true, "Contract type is required"],
      enum: ["Parcelary", "Leasing", "Harvesting", "Service", "Storage"], // Basado en tus datos
    },
    contractor_details: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    contractee_details: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
    },
    assignedEmployee: {
      employeeId: { type: String },
      name: { type: String },
      role: { type: String },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Pending", "Expired", "Archived"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["In-Kind", "Cash"],
    },
    paymentDetails: {
      // Campos para In-Kind
      commodity: { type: String },
      quantity: { type: Number },
      unit: { type: String },
      // Campos para Cash
      amount: { type: Number },
      currency: { type: String },
      // Común
      frequency: { type: String },
    },
    agroDetails: {
      area: { type: String },
      location: { type: String },
      cropType: { type: String },
      parcelId: { type: String },
      equipmentModel: { type: String },
      insuranceIncluded: { type: Boolean, default: false },
    },
    pdfUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Define TypeScript type based on Schema
export type ContractType = InferSchemaType<typeof contractSchema> & {
  _id: string;
};

const Contract =
  models.Contract || model<ContractType>("Contract", contractSchema);
export default Contract;
