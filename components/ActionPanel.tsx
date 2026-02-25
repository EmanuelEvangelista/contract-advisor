// components/ActionPanel.tsx
"use client";
import Link from "next/link";
import { FaPlus, FaFileAlt, FaCheckSquare } from "react-icons/fa";

const ActionPanel = () => {
  return (
    <section>
      <div className="flex flex-col gap-6">
        {/* Bloque 1: Botón de Acción Principal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <h3 className="text-sm font-bold text-slate-700 mb-4 tracking-tight uppercase">
            Generar Nuevo Contrato
          </h3>
          <Link
            href={"/contracts/add"}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <FaPlus size={14} />
            Nuevo Contrato
          </Link>
        </div>

        {/* Bloque 2: Plantillas Recientes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <FaFileAlt className="text-slate-400" size={14} />
            <h3 className="text-sm font-bold text-slate-700 tracking-tight uppercase">
              Plantillas Recientes
            </h3>
          </div>

          <ul className="space-y-4">
            {[
              { id: 1, name: "Servicios Estándar" },
              { id: 2, name: "Laboral - Indefinido" },
            ].map((template) => (
              <li
                key={template.id}
                className="group flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="text-blue-500 opacity-80 group-hover:opacity-100 transition-opacity">
                  <FaCheckSquare size={16} />
                </div>
                <span className="font-medium">{template.name}</span>
              </li>
            ))}
          </ul>

          <button className="w-full mt-6 py-2 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-500 transition-all">
            Ver todas las plantillas
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActionPanel;
