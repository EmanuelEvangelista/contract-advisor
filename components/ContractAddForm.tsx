"use client";

import { useState, useEffect } from "react";
import {
  FaFileContract,
  FaMapMarkedAlt,
  FaWallet,
  FaSeedling,
  FaCloudUploadAlt,
  FaUserEdit,
} from "react-icons/fa";
import { ContractFormType } from "@/types/contract";

const ContractAddForm = () => {
  const [fields, setFields] = useState<ContractFormType>({
    studioId: "", // Se llenará en el backend o vía props
    owner: "",
    contractName: "",
    contractType: "Parcelary",
    status: "Active",
    startDate: "",
    expiryDate: "",
    contractor_details: { name: "", email: "", phone: "" },
    contractee_details: { name: "", email: "", phone: "" },
    paymentMethod: "Cash",
    paymentDetails: {
      amount: 0,
      currency: "USD",
      commodity: "",
      quantity: 0,
      unit: "Tons",
      frequency: "Annual",
    },
    agroDetails: {
      area: "",
      location: "",
      cropType: "Soybean",
      parcelId: "",
      equipmentModel: "",
      insuranceIncluded: false,
    },
    assignedEmployee: { employeeId: "", name: "", email: "", role: "" },
    pdfUrl: "",
    notes: "",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState([]); // Para el select de empleados

  // Simulación de carga de empleados (Aquí harías tu fetch a /api/studio/employees)
  useEffect(() => {
    // const fetchEmployees = async () => { ... }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
          ? Number(value)
          : value;

    setFields((prev) => {
      const newState = { ...prev };
      const keys = name.split(".");
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = val;
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("data", JSON.stringify(fields));
    if (pdfFile) formData.append("file", pdfFile);

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) alert("Contract Saved Successfully");
    } catch (error) {
      console.error("Error saving contract", error);
    }
  };

  const inputStyle =
    "w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all";
  const labelStyle =
    "block text-xs font-bold text-slate-500 uppercase mb-1 ml-1";
  const sectionTitle =
    "flex items-center gap-2 text-lg font-bold text-indigo-900 border-b pb-2 mb-4 mt-8";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">New Contract</h1>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Draft Mode
        </span>
      </div>

      {/* 1. GENERAL & DATES */}
      <section>
        <h2 className={sectionTitle}>
          <FaFileContract /> General Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelStyle}>Contract Name</label>
            <input
              type="text"
              name="contractName"
              value={fields.contractName}
              onChange={handleChange}
              className={inputStyle}
              placeholder="e.g. Annual Leasing - Don Julio Field"
              required
            />
          </div>
          <div>
            <label className={labelStyle}>Contract Type</label>
            <select
              name="contractType"
              value={fields.contractType}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="Parcelary">Parcelary</option>
              <option value="Leasing">Leasing</option>
              <option value="Service">Agricultural Service</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyle}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={fields.startDate}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label className={labelStyle}>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={fields.expiryDate}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. AGRO DETAILS */}
      <section>
        <h2 className={sectionTitle}>
          <FaSeedling /> Agro Details
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={labelStyle}>Location / Field Address</label>
            <input
              type="text"
              name="agroDetails.location"
              value={fields.agroDetails.location}
              onChange={handleChange}
              placeholder="City, State, Plot number"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Area (ha)</label>
            <input
              type="text"
              name="agroDetails.area"
              value={fields.agroDetails.area}
              onChange={handleChange}
              placeholder="e.g. 150 ha"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Main Crop</label>
            <select
              name="agroDetails.cropType"
              value={fields.agroDetails.cropType}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="Soybean">Soybean</option>
              <option value="Corn">Corn</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="agroDetails.insuranceIncluded"
              checked={fields.agroDetails.insuranceIncluded}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
              id="insurance"
            />
            <label
              htmlFor="insurance"
              className="ml-2 text-sm font-medium text-slate-600"
            >
              Insurance Included
            </label>
          </div>
        </div>
      </section>

      {/* 3. PAYMENT (Tu lógica de Switch corregida) */}
      <section className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <h2 className={sectionTitle}>
          <FaWallet /> Payment Strategy
        </h2>
        <div className="flex gap-4 mb-6">
          {["Cash", "In-Kind"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() =>
                setFields((p) => ({ ...p, paymentMethod: method as any }))
              }
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${fields.paymentMethod === method ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200"}`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {fields.paymentMethod === "Cash" ? (
            <>
              <div>
                <label className={labelStyle}>Amount</label>
                <input
                  type="number"
                  name="paymentDetails.amount"
                  value={fields.paymentDetails.amount}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Currency</label>
                <select
                  name="paymentDetails.currency"
                  value={fields.paymentDetails.currency}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="USD">USD ($)</option>
                  <option value="ARS">ARS ($)</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelStyle}>Commodity</label>
                <input
                  type="text"
                  name="paymentDetails.commodity"
                  value={fields.paymentDetails.commodity}
                  onChange={handleChange}
                  placeholder="Soybean"
                  className={inputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="paymentDetails.quantity"
                  value={fields.paymentDetails.quantity}
                  onChange={handleChange}
                  placeholder="Qty"
                  className={inputStyle}
                />
                <select
                  name="paymentDetails.unit"
                  value={fields.paymentDetails.unit}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="Tons">Tons</option>
                  <option value="Quintals">Quintals</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className={labelStyle}>Frequency</label>
            <select
              name="paymentDetails.frequency"
              value={fields.paymentDetails.frequency}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="Annual">Annual</option>
              <option value="Monthly">Monthly</option>
              <option value="Single Payment">Single Payment</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. ATTACHMENT */}
      <section>
        <h2 className={sectionTitle}>
          <FaCloudUploadAlt /> Document (PDF)
        </h2>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
          <div className="text-center">
            <FaCloudUploadAlt className="mx-auto text-3xl text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 font-medium">
              {pdfFile ? pdfFile.name : "Click to upload contract PDF"}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </label>
      </section>

      <div className="flex justify-end mt-10 gap-4">
        <button
          type="button"
          className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          Save Contract
        </button>
      </div>
    </form>
  );
};

export default ContractAddForm;
