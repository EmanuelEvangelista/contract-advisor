import ContractInfo from "@/components/ContractInfo";
import contractsData from "@/contracts.json";

const HomeContracts = () => {
  // Manejamos el posible error de .map asegurando que sea un array
  const data = Array.isArray(contractsData)
    ? contractsData
    : (contractsData as any).default || [];
  return (
    // Quitamos el grid y el col-span de aquí
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">
          Contratos Recientes
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
              <th className="px-6 py-4">Cliente / Contrato</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Emisión</th>
              <th className="px-6 py-4">Vencimiento</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((contract: any) => (
              <ContractInfo key={contract._id} contract={contract} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeContracts;
