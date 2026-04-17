"use client";
import Link from "next/link";
import {
  FaFileContract,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUserShield,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

const ContractCard = ({ contract }: { contract: any }) => {
  const [hasMessages, setHasMessages] = useState(false);

  const { unreadMessages } = useGlobalContext();

  // Lógica para detectar si este contrato tiene mensajes no leídos
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await fetch("/api/messages/unread-contracts");
        if (res.ok) {
          const unreadIds = await res.json();
          setHasMessages(unreadIds.includes(contract._id));
        }
      } catch (error) {
        console.error("Error al checkear mensajes:", error);
      }
    };

    checkUnread();
  }, [contract._id, unreadMessages]);

  // Formateo de fecha simple
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-AR");

  return (
    <div
      className={`relative bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all mb-4 group cursor-pointer ${
        hasMessages
          ? "border-blue-500 bg-blue-50/20"
          : "border-slate-100 hover:border-blue-200"
      }`}
    >
      {/* SEÑAL DE MENSAJE NUEVO (Badge flotante) */}
      {hasMessages && (
        <div className="absolute -top-2.5 right-4 flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse z-10">
          <FaEnvelope size={8} />
          <span>New message</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Información Principal: Nombre y Cliente */}
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`p-3 rounded-xl transition-colors ${
              hasMessages
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
            }`}
          >
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
            Location/Area
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
            Expiry
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaCalendarAlt size={12} className="text-slate-400" />
            {formatDate(contract.expiryDate)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FaUserShield size={12} />
          <span>{contract.assignedEmployee?.name || "Unassigned"}</span>
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
