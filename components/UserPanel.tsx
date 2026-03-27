import ContractInfo from "@/components/ContractInfo";
import { fetchContracts } from "@/utils/request";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth/next";

const UserPanel = async () => {
  // 1. Obtenemos la sesión en el servidor
  const session = await getServerSession(authOptions);

  // 2. Si no hay sesión, no mostramos nada (o un mensaje)
  if (!session || !session?.user?.studioId) return null;

  const data: any = await fetchContracts(session.user.studioId);

  const contractsArray = Array.isArray(data?.contracts) ? data.contracts : [];

  const closeToExpiring = [...contractsArray]
    .sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">
          Closest to expiring
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
              <th className="px-6 py-4">Client / Contract</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date of issue</th>
              <th className="px-6 py-4">Expiration</th>
              <th className="px-6 py-4 text-center">State</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {closeToExpiring.length === 0 ? (
              // SOLUCIÓN AL ERROR DE HIDRATACIÓN:
              // Usamos una fila real que ocupe las 6 columnas
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500 italic"
                >
                  There are no contracts available at this time.
                </td>
              </tr>
            ) : (
              closeToExpiring.map((contract) => (
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
