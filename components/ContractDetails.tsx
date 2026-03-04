"use client";

import {
  FaCalendarAlt,
  FaFilePdf,
  FaMoneyBillWave,
  FaSeedling,
  FaIdCard,
  FaUserTie,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCoins,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import ContractPdfs from "@/components/ContractPdfs";

const ContractDetails = ({ contract }: { contract: any }) => {
  if (!contract) return null;

  // Cálculo de días restantes para el vencimiento
  const today = new Date();
  const expiry = new Date(contract.expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER: Título y VENCIMIENTO RESALTADO */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                {contract.contractType}
              </span>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  contract.status === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {contract.status === "Active" ? <FaCheckCircle /> : <FaClock />}{" "}
                {contract.status}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight">
              {contract.contractName}
            </h1>
            <p className="text-slate-400 font-mono text-xs">
              ID: {contract._id}
            </p>
          </div>

          {/* BLOQUE DE VENCIMIENTO (Ahora el protagonista) */}
          <div
            className={`p-6 rounded-3xl min-w-[240px] text-center shadow-xl flex flex-col items-center justify-center ${
              isExpired
                ? "bg-rose-600 text-white shadow-rose-100"
                : "bg-indigo-600 text-white shadow-indigo-100"
            }`}
          >
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">
              {isExpired ? "Expired On" : "Expiration Date"}
            </p>
            <p className="text-2xl font-black mb-1">
              {expiry.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[11px] font-bold">
              {isExpired ? (
                <>
                  <FaExclamationTriangle /> {Math.abs(diffDays)} days overdue
                </>
              ) : (
                <>
                  <FaClock /> {diffDays} days remaining
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA IZQUIERDA: Stakeholders */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-slate-800 font-black mb-6 text-sm uppercase tracking-tighter">
                <FaIdCard className="text-indigo-500" /> Stakeholders
              </h3>
              <div className="space-y-8">
                <PartyInfo
                  role="Contractor"
                  name={contract.contractor_details.name}
                  email={contract.contractor_details.email}
                  phone={contract.contractor_details.phone}
                />
                <PartyInfo
                  role="Contractee"
                  name={contract.contractee_details.name}
                  email={contract.contractee_details.email}
                  phone={contract.contractee_details.phone}
                />

                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] uppercase font-black text-indigo-400 mb-3">
                    Assigned Manager
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                      <FaUserTie size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {contract.assignedEmployee.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {contract.assignedEmployee.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Datos Técnicos y Pagos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Details */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-slate-800 font-black mb-4 text-sm uppercase tracking-tighter">
                  <FaSeedling className="text-emerald-500" /> Technical Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem
                    label="Location"
                    value={contract.agroDetails.location}
                    icon={<FaMapMarkerAlt />}
                  />
                  <DetailItem
                    label="Crop Type"
                    value={contract.agroDetails.cropType}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem
                      label="Area"
                      value={`${contract.agroDetails.area} Ha`}
                    />
                    <DetailItem
                      label="Parcel ID"
                      value={contract.agroDetails.parcelId}
                    />
                  </div>
                  <DetailItem
                    label="Equipment"
                    value={contract.agroDetails.equipmentModel}
                  />
                </div>
              </div>

              {/* Payment Details (MONTO AQUÍ, MÁS DISCRETO) */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-slate-800 font-black mb-4 text-sm uppercase tracking-tighter">
                  <FaMoneyBillWave className="text-amber-500" /> Financial Terms
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Contract Value
                    </p>
                    <p className="text-xl font-black text-slate-800">
                      QQ {contract.paymentDetails.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Method" value={contract.paymentMethod} />
                    <DetailItem
                      label="Frequency"
                      value={contract.paymentDetails.frequency}
                    />
                  </div>

                  {contract.paymentMethod === "In-Kind" && (
                    <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                      <FaBoxOpen className="text-amber-500" />
                      <p className="text-xs font-bold text-amber-800 uppercase leading-tight">
                        {contract.paymentDetails.quantity}{" "}
                        {contract.paymentDetails.unit} of{" "}
                        {contract.paymentDetails.commodity}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fecha de Inicio (Separada para no saturar) */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-500">
                <FaCalendarAlt size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Contract Commencement
                </p>
                <p className="text-md font-bold text-slate-700">
                  {new Date(contract.startDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NOTAS INTERNAS */}
        {contract.notes && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-black mb-3 text-sm uppercase tracking-tighter">
              <FaStickyNote className="text-slate-400" /> Observations
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed italic bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
              "{contract.notes}"
            </p>
          </div>
        )}

        <ContractPdfs pdfs={contract.pdfs} />
      </div>
    </div>
  );
};

// Helpers
const PartyInfo = ({ role, name, email, phone }: any) => (
  <div className="group">
    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">
      {role}
    </p>
    <p className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
      {name}
    </p>
    <div className="mt-1">
      <p className="text-xs text-slate-500">{email}</p>
      <p className="text-xs font-bold text-slate-400">{phone}</p>
    </div>
  </div>
);

const DetailItem = ({ label, value, icon }: any) => (
  <div>
    <p className="text-[10px] uppercase font-black text-slate-300 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="text-sm font-bold text-slate-700">{value || "---"}</p>
  </div>
);

export default ContractDetails;
