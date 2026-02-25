import {
  FaCalendarAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaFilePdf,
  FaMoneyBillWave,
  FaSeedling,
  FaIdCard,
  FaPhone,
} from "react-icons/fa";

const ContractDetails = ({ contract }: { contract: any }) => {
  if (!contract) return <p className="text-slate-500">Cargando detalles...</p>;

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header: Título y Estado */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
          <div>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {contract.contractType}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
              {contract.contractName}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              ID del Contrato:{" "}
              <span className="font-mono text-slate-800">{contract._id}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                contract.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {contract.status}
            </span>
            {contract.pdfUrl && (
              <a
                href={contract.pdfUrl}
                target="_blank"
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                <FaFilePdf size={18} /> Ver PDF Original
              </a>
            )}
          </div>
        </div>

        {/* Grid de Información Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloque 1: Partes Involucradas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3">
              <FaIdCard className="text-blue-500" /> Partes del Contrato
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Contratista (Dueño)
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {contract.contractor_details.name}
                </p>
                <p className="text-xs text-slate-500">
                  {contract.contractor_details.email}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Contratado (Empresa/Campo)
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {contract.contractee_details.name}
                </p>
                <p className="text-xs text-slate-500">
                  {contract.contractee_details.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Bloque 2: Detalles de Pago */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3">
              <FaMoneyBillWave className="text-green-500" /> Condiciones de Pago
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Método: {contract.paymentMethod}
              </p>
              <p className="text-lg font-black text-slate-800 mt-1">
                {contract.paymentMethod === "In-Kind"
                  ? `${contract.paymentDetails.quantity} ${contract.paymentDetails.unit} de ${contract.paymentDetails.commodity}`
                  : `${contract.paymentDetails.amount} ${contract.paymentDetails.currency}`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {contract.paymentDetails.frequency}
              </p>
            </div>
          </div>

          {/* Bloque 3: Información Agropecuaria / Técnica */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3">
              <FaSeedling className="text-emerald-500" /> Detalles Técnicos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Ubicación/Modelo
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {contract.agroDetails.location ||
                    contract.agroDetails.equipmentModel}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Área / Seguro
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {contract.agroDetails.area ||
                    (contract.agroDetails.insuranceIncluded
                      ? "Seguro Incluido"
                      : "Sin Seguro")}
                </p>
              </div>
            </div>
          </div>

          {/* Bloque 4: Fechas y Responsable */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b pb-3">
              <FaCalendarAlt className="text-orange-500" /> Gestión y Fechas
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Vence el
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {new Date(contract.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Responsable
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {contract.assignedEmployee.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {contract.assignedEmployee.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
