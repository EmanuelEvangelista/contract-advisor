"use client";

import { useState, useEffect, useRef } from "react";

import {
  FaFileContract,
  FaUserFriends,
  FaWallet,
  FaSeedling,
  FaCloudUploadAlt,
  FaStickyNote,
} from "react-icons/fa";

import { ContractFormType } from "@/types/contract";

interface ContractFormState extends Omit<ContractFormType, "pdfs"> {
  pdfs: (File | string)[];
}

const initialState: ContractFormState = {
  studioId: "",
  owner: null,
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
    quintalsPerHa: 0,
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
  assignedEmployee: {
    employeeId: "",
    name: "",
    email: "",
    role: "",
  },
  pdfs: [],
  notes: "",
};

const ContractAddForm = () => {
  const [fields, setFields] = useState<ContractFormState>(
    initialState as ContractFormState,
  );
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Simulación de carga de empleados (Aquí harías tu fetch a /api/studio/employees)
  useEffect(() => {
    // const fetchEmployees = async () => { ... }
  }, []);

  useEffect(() => {
    // 1. Calculamos el valor y lo guardamos en 'totalCalculated'
    const totalCalculated =
      Number(fields?.agroDetails?.area || 0) *
      (fields?.paymentDetails?.quintalsPerHa || 0);

    // 2. Solo actualizamos si el total cambió
    if (totalCalculated !== fields?.paymentDetails?.amount) {
      setFields((prev) => ({
        ...prev,
        paymentDetails: {
          // Mantén todo lo que ya tenía paymentDetails (currency, frequency, etc.)
          ...prev.paymentDetails,
          // Actualiza solo el amount con el nuevo cálculo
          amount: totalCalculated,
          // Como frequency es obligatorio en tu tipo, nos aseguramos de que esté
          frequency: prev.paymentDetails?.frequency || "Annual",
        } as any,
      }));
    }
  }, [fields?.agroDetails?.area, fields?.paymentDetails?.quintalsPerHa]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFields((prev) => ({
        ...prev,
        pdfs: [...(prev.pdfs || []), ...newFiles],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // 🔥 NUEVO: separar archivos y urls
    const newFiles: File[] = [];
    const existingUrls: string[] = [];

    fields.pdfs.forEach((item) => {
      if (item instanceof File) {
        newFiles.push(item);
      } else {
        existingUrls.push(item);
      }
    });

    // 🔥 mandar JSON sin archivos
    formData.append(
      "data",
      JSON.stringify({
        ...fields,
        pdfs: existingUrls,
      }),
    );

    // 🔥 mandar archivos correctamente
    newFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Contract Saved Successfully!");
        setFields(initialState);
        formRef.current?.reset();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error saving contract", error);
    } finally {
      setLoading(false);
    }
  };
  // --- Estilos Reutilizables ---
  const sectionTitle =
    "flex items-center gap-2 text-xl font-bold text-slate-800 mb-5 border-b pb-2";
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1";
  const inputStyle =
    "w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-600";

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
      <section className="mb-10">
        <h2 className={sectionTitle}>
          <FaFileContract className="text-indigo-600" /> General Information
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label htmlFor="contractName" className={labelStyle}>
              Contract Name
            </label>
            <input
              id="contractName"
              name="contractName"
              type="text"
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
              required
            >
              <option value="Parcelary">Parcelary</option>
              <option value="Leasing">Leasing</option>
              <option value="Service">Agricultural Service</option>
            </select>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* 2. PARTIES INVOLVED (Solución a los errores de validación) */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          <FaUserFriends className="text-indigo-600" /> Parties Involved
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contractor */}
          <div className="space-y-3 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">
              Contractor (Provider)
            </h3>
            <div>
              <label className={labelStyle}>Full Name</label>
              <input
                type="text"
                name="contractor_details.name"
                value={fields.contractor_details.name}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Name or Company"
                required
              />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                name="contractor_details.email"
                value={fields.contractor_details.email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className={labelStyle}>Phone</label>
              <input
                type="tel"
                name="contractor_details.phone"
                value={fields.contractor_details.phone}
                onChange={handleChange}
                className={inputStyle}
                placeholder="555444555"
                required
              />
            </div>
          </div>

          {/* Contractee */}
          <div className="space-y-3 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">
              Contractee (Client)
            </h3>
            <div>
              <label className={labelStyle}>Full Name</label>
              <input
                type="text"
                name="contractee_details.name"
                value={fields.contractee_details.name}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Name or Company"
                required
              />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                name="contractee_details.email"
                value={fields.contractee_details.email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className={labelStyle}>Phone</label>
              <input
                type="number"
                name="contractee_details.phone"
                value={fields.contractee_details.phone}
                onChange={handleChange}
                className={inputStyle}
                placeholder="555444555"
                required
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. AGRO DETAILS */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          <FaSeedling className="text-indigo-600" /> Agro Details
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={labelStyle}>Location / Field Address</label>
            <input
              type="text"
              name="agroDetails.location"
              value={fields?.agroDetails?.location}
              onChange={handleChange}
              placeholder="City, State, Plot number"
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>Area (ha)</label>
            <input
              type="number"
              name="agroDetails.area"
              value={fields?.agroDetails?.area}
              onChange={handleChange}
              placeholder="e.g. 150"
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>Main Crop</label>
            <select
              name="agroDetails.cropType"
              value={fields?.agroDetails?.cropType}
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
              checked={fields?.agroDetails?.insuranceIncluded}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              id="insurance"
            />
            <label
              htmlFor="insurance"
              className="ml-2 text-sm font-medium text-slate-600 cursor-pointer"
            >
              Insurance Included
            </label>
          </div>
        </div>
      </section>

      {/* 4. PAYMENT STRATEGY */}
      <section className="mb-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
        <h2 className={sectionTitle}>
          <FaWallet className="text-indigo-600" /> Payment Strategy
        </h2>

        <div className="flex gap-4 mb-6">
          {["Cash", "In-Kind"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() =>
                setFields((p) => ({ ...p, paymentMethod: method as any }))
              }
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                fields.paymentMethod === method
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {fields.paymentMethod === "In-Kind" ? (
            <>
              {/* SELECT PARA COMMODITY EN IN-KIND */}
              <div>
                <label className={labelStyle}>Commodity</label>
                <select
                  name="paymentDetails.commodity"
                  value={fields?.paymentDetails?.commodity}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                >
                  <option value="">Select Grain</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Corn">Corn</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Sunflower">Sunflower</option>
                  <option value="Sorghum">Sorghum</option>
                  <option value="Barley">Barley</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Quantity</label>
                  <input
                    type="number"
                    name="paymentDetails.quantity"
                    value={fields?.paymentDetails?.quantity}
                    onChange={handleChange}
                    placeholder="Qty"
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>Unit</label>
                  <select
                    name="paymentDetails.unit"
                    value={fields?.paymentDetails?.unit}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="Tons">Tons</option>
                    <option value="Quintals">Quintals</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* SECCIÓN CASH CON CÁLCULO DE QUINTALES */}
              <div>
                <label className={labelStyle}>Quintals per HA</label>
                <input
                  type="number"
                  name="paymentDetails.quintalsPerHa"
                  value={fields?.paymentDetails?.quintalsPerHa}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="0"
                />
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm">
                <label className="text-indigo-900 font-bold block text-xs uppercase mb-1">
                  Total Amount
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600 font-bold text-xl">QQ</span>
                  <input
                    type="number"
                    name="paymentDetails.amount"
                    value={fields?.paymentDetails?.amount}
                    readOnly
                    className="bg-transparent text-xl font-black text-indigo-700 outline-none w-full"
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Currency</label>
                <select
                  name="paymentDetails.currency"
                  value={fields?.paymentDetails?.currency}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="USD">USD ($)</option>
                  <option value="ARS">ARS ($)</option>
                </select>
              </div>
            </>
          )}

          {/* LA FRECUENCIA SE MANTIENE PARA AMBOS MÉTODOS */}
          <div>
            <label className={labelStyle}>Frequency</label>
            <select
              name="paymentDetails.frequency"
              value={fields?.paymentDetails?.frequency}
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

      {/* 5. NOTES */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          <FaStickyNote className="text-indigo-600" /> Additional Notes
        </h2>
        <textarea
          name="notes"
          rows={3}
          value={fields.notes}
          onChange={handleChange}
          className={`${inputStyle} resize-none h-28`}
          placeholder="Write any legal details, special clauses, or important reminders here..."
        />
      </section>

      {/* 6. ATTACHMENT */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          <FaCloudUploadAlt className="text-indigo-600" /> Document (PDF)
        </h2>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
          <div className="text-center">
            <FaCloudUploadAlt className="mx-auto text-3xl text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
            <p className="text-sm text-slate-600 font-medium">
              {fields.pdfs && fields.pdfs.length > 0 ? (
                <span className="text-indigo-600 font-bold">
                  {/* Si hay 1 solo, muestra el nombre. Si hay varios, muestra la cantidad */}
                  {fields.pdfs.length === 1
                    ? fields.pdfs[0] instanceof File
                      ? fields.pdfs[0].name
                      : "Archivo cargado"
                    : `${fields.pdfs.length} files selected`}
                </span>
              ) : (
                "Click to upload contract PDF"
              )}
            </p>
          </div>
          <input
            type="file"
            id="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {fields.pdfs && fields.pdfs.length > 0 && (
            <div className="mt-4 space-y-2">
              {fields.pdfs.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                >
                  <span className="text-xs text-slate-500 truncate max-w-[250px] italic">
                    {file instanceof File ? file.name : "Documento guardado"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFields((prev) => ({
                        ...prev,
                        pdfs: [
                          ...(prev.pdfs || []).filter((_, i) => i !== index),
                        ],
                      }));
                    }}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </label>
      </section>

      {/* ACTIONS */}
      <div className="flex justify-end items-center mt-10 gap-6 border-t pt-8">
        <button
          type="button"
          className="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          disabled={!fields.contractName.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Contract
        </button>
      </div>
    </form>
  );
};

export default ContractAddForm;
