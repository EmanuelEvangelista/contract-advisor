"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaUserTie, FaFileSignature } from "react-icons/fa";

const ContractSearchForm = () => {
  const [keyword, setKeyword] = useState("");
  const [employee, setEmployee] = useState("");
  const [contractType, setContractType] = useState("All");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construimos los parámetros dinámicamente
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (employee) params.append("employee", employee);
    if (contractType !== "All") params.append("type", contractType);

    const queryString = params.toString();

    // Si no hay filtros, vamos a la lista general, sino a resultados
    if (!queryString) {
      router.push(`/contracts`);
    } else {
      router.push(`/contracts/search?${queryString}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-2 w-full max-w-5xl mx-auto"
    >
      {/* 1. Búsqueda por Palabra Clave / Cliente */}
      <div className="w-full md:flex-[2] relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="Cliente, CUIT o Contrato..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-none text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* 2. Búsqueda por Empleado Responsable */}
      <div className="w-full md:flex-[1.5] relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <FaUserTie size={14} />
        </div>
        <input
          type="text"
          placeholder="Empleado encargado..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-none text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        />
      </div>

      {/* 3. Selector de Tipo de Contrato */}
      <div className="w-full md:flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <FaFileSignature size={14} />
        </div>
        <select
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-none text-slate-800 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-sm"
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
        >
          <option value="All">All types</option>
          <option value="Parcelary">Leasing</option>
          <option value="Leasing">Parcelary</option>
          <option value="Harvesting">"Harvesting"</option>
          <option value="Service">Service</option>
          <option value="Storage">Storage</option>
        </select>
      </div>

      {/* Botón de acción */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
      >
        Search
      </button>
    </form>
  );
};

export default ContractSearchForm;
