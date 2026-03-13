"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";

const EmployeeStatusCard = ({ employee }: { employee: any }) => {
  // El estado inicial debe venir del prop 'status' del empleado
  const [isActive, setIsActive] = useState(employee.status === "active");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = isActive ? "inactive" : "active";

    try {
      // 1. Llamada a la API para actualizar el estado en la DB
      const res = await fetch(`/api/users/${employee._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // 2. Si la DB se actualizó, cambiamos la UI
        setIsActive(!isActive);
        toast.success(
          `Empleado ${newStatus === "active" ? "activado" : "puesto en modo auditoría"}`,
        );
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Error al actualizar estado");
      }
    } catch (error) {
      console.error("Error toggleStatus:", error);
      toast.error("Fallo de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-5 rounded-[2rem] border transition-all flex items-center justify-between ${
        isActive
          ? "bg-white border-slate-100 shadow-sm"
          : "bg-slate-50 border-slate-200 opacity-75"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors ${
            isActive
              ? "bg-emerald-100 text-emerald-600"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {isActive ? <FaUserCheck /> : <FaUserSlash />}
        </div>
        <div>
          <p className="font-black text-slate-800 leading-tight">
            {employee.name || employee.username}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {employee.role}
            </span>
            <span
              className={`text-[10px] font-black uppercase ${
                isActive ? "text-emerald-500" : "text-slate-400"
              }`}
            >
              • {isActive ? "Activo" : "Pasivo (Auditoría)"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label
          className={`relative inline-flex items-center ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={toggleStatus}
            disabled={loading}
          />
          <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
    </div>
  );
};

export default EmployeeStatusCard;
