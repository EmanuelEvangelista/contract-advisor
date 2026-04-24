import UserPanel from "@/components/UserPanel";
import ContractsState from "@/components/ContractsState";
import ActionPanel from "@/components/ActionPanel";

export const dynamic = "force-dynamic";

const PanelPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 pt-8 px-6 max-w-[1400px] mx-auto">
      {/* Stats arriba - Ocupa todo el ancho */}
      <ContractsState />

      {/* Grid Maestro */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12 items-start">
        {/* Lado Izquierdo: Contratos (3/4) */}
        <div className="lg:col-span-3">
          <UserPanel />
        </div>

        {/* Lado Derecho: Acciones Rápidas (1/4) */}
        <aside className="lg:col-span-1 sticky top-24">
          <ActionPanel />
        </aside>
      </div>
    </main>
  );
};

export default PanelPage;
