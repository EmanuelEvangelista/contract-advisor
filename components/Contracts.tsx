import ContractCard from "./ContractCard";
import { FaSearch } from "react-icons/fa";
import contractsData from "@/contracts.json";

const Contracts = () => {
  // 1. Si es array, lo usa.
  // 2. Si es un módulo con .default, lo extrae.
  // 3. Si falla todo, devuelve un array vacío para que no rompa el .map
  const contracts = Array.isArray(contractsData)
    ? contractsData
    : (contractsData as any).default || [];

  return (
    <section className="w-full">
      {/* Buscador */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <FaSearch size={16} />
        </div>
        <input
          type="text"
          placeholder="Buscar contratos..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Renderizado seguro */}
      <div className="space-y-4">
        {contracts.map((contract: any) => (
          <ContractCard key={contract._id} contract={contract} />
        ))}
      </div>
    </section>
  );
};

export default Contracts;
