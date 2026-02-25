// app/page.tsx
"use client";
import ContractsState from "@/components/ContractsState";
import HomeContracts from "@/components/HomeContracts";
import ActionPanel from "@/components/ActionPanel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 px-6 max-w-[1400px] mx-auto">
      {/* Stats arriba */}
      <ContractsState />

      {/* Grid Maestro */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8 items-start">
        {/* Tabla: Ocupa 3 de 4 columnas */}
        <div className="lg:col-span-3">
          <HomeContracts />
        </div>

        {/* Panel: Ocupa 1 de 4 columnas y se queda fijo al bajar */}
        <aside className="lg:col-span-1 sticky top-24">
          <ActionPanel />
        </aside>
      </div>
    </main>
  );
}
