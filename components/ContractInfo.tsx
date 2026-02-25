// components/ContractRow.tsx
import { FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

const ContractInfo = ({ contract }: { contract: any }) => {
  // Función para determinar el estilo del badge
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-700">
          {contract.contractee_details.name}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {contract.contractName}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        {contract.contractType}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {new Date(contract.startDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-slate-700">
        {new Date(contract.expiryDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-tighter ${getStatusStyles(contract.status)}`}
        >
          {contract.status === "Active" ? "Activo" : "Vencido"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-3">
          {contract.pdfUrl && (
            <a
              href={contract.pdfUrl}
              target="_blank"
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Ver PDF"
            >
              <FaFilePdf size={16} />
            </a>
          )}
          <Link
            href={`/contracts/${contract._id}`}
            className="text-slate-400 hover:text-blue-500 transition-colors"
          >
            <FaExternalLinkAlt size={14} />
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default ContractInfo;
