// components/ActionPanel.tsx
"use client";
import Link from "next/link";
import { FaPlus, FaFileAlt, FaCheckSquare, FaUser } from "react-icons/fa";

const ActionPanel = () => {
  return (
    <section className="flex flex-col gap-6">
      {/* Bloque 1: Botón de Acción Principal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <h3 className="text-[10px] font-black text-slate-400 mb-4 tracking-[0.15em] uppercase">
          Acciones Rápidas
        </h3>
        <Link
          href={"/contracts/add"}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <FaPlus size={14} />
          Nuevo Contrato
        </Link>
      </div>

      {/* Bloque 2: Gestión de Personal (Solo visible para contador según tu lógica) */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
        <h3 className="text-[10px] font-black text-slate-500 mb-4 tracking-[0.15em] uppercase">
          Administración
        </h3>
        <Link
          href={"/studio/employees"}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 border border-slate-700"
        >
          <FaUser className="text-indigo-400" size={16} />
          Gestionar Personal
        </Link>
        <p className="text-[10px] text-slate-500 mt-3 text-center italic">
          Acceso exclusivo para Contadores
        </p>
      </div>

      {/* Bloque 3: Plantillas Recientes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <FaFileAlt className="text-indigo-600" size={12} />
          <h3 className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">
            Plantillas Recientes
          </h3>
        </div>

        <ul className="space-y-3">
          {[
            { id: 1, name: "Servicios Estándar" },
            { id: 2, name: "Laboral - Indefinido" },
          ].map((template) => (
            <li
              key={template.id}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-indigo-500 p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <FaCheckSquare size={14} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {template.name}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <button className="w-full mt-6 py-3 text-[11px] font-black text-slate-400 border-2 border-dashed border-slate-100 rounded-xl hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all uppercase tracking-widest">
          Ver todas las plantillas
        </button>
      </div>
    </section>
  );
};

export default ActionPanel;
