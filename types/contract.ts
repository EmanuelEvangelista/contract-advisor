import { ContractType } from "@/models/Contract";

export type ContractFormType = Omit<
  ContractType,
  "_id" | "createdAt" | "updatedAt"
>;
