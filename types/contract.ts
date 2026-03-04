export type ContractTypeEnum =
  | "Parcelary"
  | "Leasing"
  | "Harvesting"
  | "Service"
  | "Storage";

export type ContractStatusEnum = "Active" | "Pending" | "Expired" | "Archived";

export type PaymentMethodEnum = "Cash" | "In-Kind";

export type CurrencyEnum = "USD" | "ARS";

export type UnitEnum = "Tons" | "Quintals";

export type PaymentFrequencyEnum = "Annual" | "Monthly" | "Single Payment";

export type CropTypeEnum = "Soybean" | "Corn" | "Wheat";

// ===== SUBTYPES =====

export type PartyDetails = {
  name: string;
  email: string;
  phone?: string;
};

export type AssignedEmployeeForm = {
  employeeId: string;
  name: string;
  email: string;
  role: string;
};

export type PaymentDetailsForm = {
  // Cash
  amount?: number;
  currency?: CurrencyEnum;
  quintalsPerHa?: number;

  // In-Kind
  commodity?: string;
  quantity?: number;
  unit?: UnitEnum;

  // Shared
  frequency: PaymentFrequencyEnum;
};

export type AgroDetailsForm = {
  area?: string;
  location?: string;
  cropType?: CropTypeEnum;
  parcelId?: string;
  equipmentModel?: string;
  insuranceIncluded: boolean;
};

// ===== MAIN FORM TYPE =====

export type ContractFormType = {
  studioId: string;
  owner: string;

  contractName: string;
  contractType: ContractTypeEnum;
  status: ContractStatusEnum;

  startDate: string; // "YYYY-MM-DD"
  expiryDate: string; // "YYYY-MM-DD"

  contractor_details: PartyDetails;
  contractee_details: PartyDetails;

  paymentMethod: PaymentMethodEnum;
  paymentDetails: PaymentDetailsForm;

  agroDetails: AgroDetailsForm;

  assignedEmployee?: AssignedEmployeeForm;

  pdfs?: File[];
  notes?: string;
};
