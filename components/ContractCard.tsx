import Link from "next/link";
import {
  FaFileContract,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ContractCard = ({ contract }: { contract: any }) => {
  // Formateo de fecha simple
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-AR");

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all mb-4 group cursor-pointer hover:border-blue-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Información Principal: Nombre y Cliente */}
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FaFileContract size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight mb-1">
              {contract.contractName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FaUser size={12} />
              <span>{contract.contractee_details.name}</span>
            </div>
          </div>
        </div>

        {/* Detalles del Agro / Ubicación */}
        <div className="flex flex-col gap-1 flex-1 lg:border-l lg:pl-6 border-slate-100">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            Ubicación / Área
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
            <FaMapMarkerAlt size={12} className="text-slate-400" />
            {contract.agroDetails.location ||
              contract.agroDetails.area ||
              "N/A"}
          </div>
        </div>

        {/* Fechas */}
        <div className="flex flex-col gap-1 flex-1 lg:border-l lg:pl-6 border-slate-100">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            Vencimiento
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaCalendarAlt size={12} className="text-slate-400" />
            {formatDate(contract.expiryDate)}
          </div>
        </div>

        {/* Estado y Acciones */}
        <div className="flex items-center justify-between lg:justify-end gap-6 flex-1">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              contract.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {contract.status}
          </span>
          <Link
            href={`/contracts/${contract._id}`}
            className="text-slate-400 hover:text-blue-600 transition-colors text-sm font-bold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContractCard;
