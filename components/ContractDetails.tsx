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
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import ContractPdfs from "@/components/ContractPdfs";
import ContractActions from "@/components/ContractAction";
import { useRouter } from "next/navigation";

const ContractDetails = ({ contract }: { contract: any }) => {
  const router = useRouter();
  if (!contract) return null;
  // Cálculo de días restantes
  const today = new Date();
  const expiry = new Date(contract.expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;

  const handleUpdate = () => {
    // Esto refresca los Server Components en Next.js 13/14/15
    router.refresh();
  };
  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      {/* ACCIONES FLOTANTES O SUPERIORES */}
      <ContractActions
        contractId={contract._id}
        contractOwner={contract.owner?._id || contract.owner}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER: Título y Vencimiento */}
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
            <p className="text-slate-400 font-mono text-xs italic">
              ID: {contract._id}
            </p>
          </div>

          {/* INDICADOR DE VENCIMIENTO */}
          <div
            className={`p-6 rounded-3xl min-w-[240px] text-center shadow-xl flex flex-col items-center justify-center ${
              isExpired
                ? "bg-rose-600 text-white shadow-rose-100"
                : "bg-indigo-600 text-white shadow-indigo-100"
            }`}
          >
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">
              {isExpired ? "Expiró el" : "Fecha de Vencimiento"}
            </p>
            <p className="text-2xl font-black mb-1">
              {expiry.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[11px] font-bold">
              {isExpired ? (
                <>
                  <FaExclamationTriangle /> {Math.abs(diffDays)} días vencido
                </>
              ) : (
                <>
                  <FaClock /> {diffDays} días restantes
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA IZQUIERDA: Responsables y Asignación */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stakeholders Info */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-slate-800 font-black mb-6 text-sm uppercase tracking-tighter">
                <FaIdCard className="text-indigo-500" /> Partes Legales
              </h3>
              <div className="space-y-8">
                <PartyInfo
                  role="Contratante"
                  name={contract.contractor_details.name}
                  email={contract.contractor_details.email}
                />
                <PartyInfo
                  role="Contratado"
                  name={contract.contractee_details.name}
                  email={contract.contractee_details.email}
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Datos Técnicos y Finanzas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Details */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-slate-800 font-black mb-4 text-sm uppercase tracking-tighter">
                  <FaSeedling className="text-emerald-500" /> Datos de
                  Obra/Campo
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem
                    label="Ubicación"
                    value={contract.agroDetails.location}
                    icon={<FaMapMarkerAlt />}
                  />
                  <DetailItem
                    label="Cultivo"
                    value={contract.agroDetails.cropType}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem
                      label="Superficie"
                      value={`${contract.agroDetails.area} Ha`}
                    />
                    <DetailItem
                      label="Parcela ID"
                      value={contract.agroDetails.parcelId}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Terms */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-slate-800 font-black mb-4 text-sm uppercase tracking-tighter">
                  <FaMoneyBillWave className="text-amber-500" /> Condiciones
                  Financieras
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Valor Total
                    </p>
                    <p className="text-xl font-black text-slate-800">
                      {contract.paymentDetails.currency}{" "}
                      {contract.paymentDetails.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Método" value={contract.paymentMethod} />
                    <DetailItem
                      label="Frecuencia"
                      value={contract.paymentDetails.frequency}
                    />
                  </div>
                  {contract.paymentMethod === "In-Kind" && (
                    <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                      <FaBoxOpen className="text-amber-500" />
                      <p className="text-xs font-bold text-amber-800 uppercase leading-tight">
                        {contract.paymentDetails.quantity}{" "}
                        {contract.paymentDetails.unit} de{" "}
                        {contract.paymentDetails.commodity}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fecha de Inicio */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-500">
                <FaCalendarAlt size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Inicio de Vigencia
                </p>
                <p className="text-md font-bold text-slate-700">
                  {new Date(contract.startDate).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* OBSERVACIONES */}
            {contract.notes && (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-slate-800 font-black mb-3 text-sm uppercase tracking-tighter">
                  <FaStickyNote className="text-slate-400" /> Observaciones
                </h3>
                <p className="text-slate-600 text-sm italic bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                  "{contract.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* VISOR DE PDFS */}
        <ContractPdfs pdfs={contract.pdfs} />
      </div>
    </div>
  );
};

// Helpers Internos
const PartyInfo = ({ role, name, email }: any) => (
  <div className="group">
    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">
      {role}
    </p>
    <p className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
      {name}
    </p>
    <p className="text-xs text-slate-500">{email}</p>
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
