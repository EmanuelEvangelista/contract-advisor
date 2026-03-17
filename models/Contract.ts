import {
  Schema,
  model,
  models,
  InferSchemaType,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

const contractSchema = new Schema<any>(
  {
    // ===== RELATIONS =====

    studioId: {
      type: Schema.Types.ObjectId, // Mongoose espera Types.ObjectId
      ref: "Studio",
      required: [true, "Studio ID is required"],
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId, // Mongoose espera Types.ObjectId
      ref: "User",
      required: [true, "Owner ID is required"],
      index: true,
    },

    // ===== BASIC INFO =====

    contractName: {
      type: String,
      required: [true, "Contract name is required"],
      trim: true,
    },

    contractType: {
      type: String,
      required: true,
      enum: ["Parcelary", "Leasing", "Harvesting", "Service", "Storage"],
    },

    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Pending", "Expired", "Archived"],
      index: true,
    },

    // ===== PARTIES =====

    contractor_details: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
    },

    contractee_details: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
    },

    // Snapshot version (legal safety)
    assignedEmployee: {
      employeeId: { type: String },
      name: { type: String },
      email: { type: String },
      role: { type: String },
    },

    // ===== DATES =====

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },

    // ===== PAYMENT =====

    paymentMethod: {
      type: String,
      required: true,
      enum: ["In-Kind", "Cash"],
    },

    paymentDetails: {
      amount: Number,

      currency: {
        type: String,
        enum: ["USD", "ARS"],
      },

      commodity: String,
      quantity: Number,

      unit: {
        type: String,
        enum: ["Tons", "Quintals"],
      },

      frequency: {
        type: String,
        enum: ["Annual", "Monthly", "Single Payment"],
      },
    },

    // ===== AGRO INFO =====

    agroDetails: {
      area: { type: String },
      location: { type: String },
      cropType: { type: String },
      parcelId: { type: String },
      equipmentModel: { type: String },
      insuranceIncluded: { type: Boolean, default: false },
    },

    // ===== DOCUMENTS =====

    pdfs: {
      type: [{ type: String }],
      default: null,
    },

    notes: {
      type: String,
      trim: true,
    },
    expiryNotificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Multi-tenant filtering
contractSchema.index({ studioId: 1, status: 1 });

// Expiration queries (very common in SaaS)
contractSchema.index({ studioId: 1, expiryDate: 1 });

// ===== TYPES =====

export type ContractType = InferSchemaType<typeof contractSchema> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

contractSchema.pre<any>("save", function (next) {
  const doc = this;
  if (doc.expiryDate) {
    doc.expiryDate.setHours(0, 0, 0, 0);
  }
  if (doc.startDate) {
    doc.startDate.setHours(0, 0, 0, 0);
  }
});

const Contract = models.Contract || model("Contract", contractSchema);

export default Contract;
