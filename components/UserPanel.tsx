import ContractInfo from "@/components/ContractInfo";

import { fetchContracts } from "@/utils/request";

const UserPanel = async () => {
  // Manejamos el posible error de .map asegurando que sea un array

  const data: any = await fetchContracts();

  // 1. Aseguramos que data.contracts sea un array
  const contractsArray = Array.isArray(data?.contracts) ? data.contracts : [];

  // 2. Ordenamos por fecha de creación (de más nuevo a más viejo) y tomamos 3
  const recentContracts = [...contractsArray]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // El más reciente primero
    })
    .slice(0, 3);
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
            {recentContracts.length === 0 ? (
              <p className="text-center text-slate-500 col-span-3">
                No contracts available at the moment.
              </p>
            ) : (
              recentContracts.map((contract) => (
                <ContractInfo key={contract._id} contract={contract} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPanel;
