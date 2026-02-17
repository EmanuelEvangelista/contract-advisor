// app/page.tsx
"use client";
import StatsGrid from "@/components/StatsGrid";
import ContractTable from "@/components/ContractTable";
import ActionPanel from "@/components/ActionPanel";

// Aquí simulamos la carga de tus datos de prueba
const contractsData = [
  {
    _id: "1",
    contractName: "Parcelary Sharecropping - Sector A1",
    contractType: "Parcelary",
    contractee_details: { name: "Establecimiento Las Marias" },
    startDate: "2025-05-01T00:00:00.000Z",
    expiryDate: "2026-03-03T00:00:00.000Z",
    status: "Active",
    pdfUrl:
      "https://storage.contractadvisor.com/v1/files/contract_001_signed.pdf",
  },
  {
    _id: "2",
    contractName: "Corn Production Parcel - North Wing",
    contractType: "Parcelary",
    contractee_details: { name: "Agropecuaria del Norte" },
    startDate: "2025-09-01T00:00:00.000Z",
    expiryDate: "2026-09-01T00:00:00.000Z",
    status: "Active",
    pdfUrl: null,
  },
  {
    _id: "3",
    contractName: "Machinery Leasing - JD 7J",
    contractType: "Leasing",
    contractee_details: { name: "Maquinarias Don Bosco" },
    startDate: "2026-03-01T00:00:00.000Z",
    expiryDate: "2027-03-01T00:00:00.000Z",
    status: "Active",
    pdfUrl:
      "https://storage.contractadvisor.com/v1/files/leasing_jd7j_final.pdf",
  },
];

export default function HomePage() {
  return (
    // El pt-28 es para que no se pegue al Navbar fijo que tienes
    <main className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard de Vencimientos
          </h1>
          <p className="text-slate-500 mt-1">
            Gestión de contratos agropecuarios y leasings.
          </p>
        </div>

        {/* Los 3 Cuadros de Estadísticas */}
        <StatsGrid contracts={contractsData} />

        {/* Layout de dos columnas: Tabla y Acciones */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Columna Izquierda: Tabla (75% del ancho en desktop) */}
          <div className="lg:col-span-3">
            <ContractTable contracts={contractsData} />
          </div>

          {/* Columna Derecha: Panel de Acciones (25% del ancho en desktop) */}
          <div className="lg:col-span-1">
            <ActionPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
