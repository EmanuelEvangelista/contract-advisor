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

export interface ContractType {
  _id: string;
  name: string;
  createdAt: string;
  studioId: string;
}

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
  _id?: string;

  studioId: any;
  owner: any;

  contractName: string;
  contractType: ContractTypeEnum;
  status: ContractStatusEnum;

  startDate: string;
  expiryDate: string;

  contractor_details: PartyDetails;
  contractee_details: PartyDetails;

  paymentMethod: PaymentMethodEnum;
  paymentDetails?: PaymentDetailsForm;

  agroDetails?: AgroDetailsForm;

  assignedEmployee?: AssignedEmployeeForm;

  pdfs?: string[];

  notes?: string;

  createdAt?: string;
  updatedAt?: string;
};
