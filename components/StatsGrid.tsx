// components/StatsGrid.tsx
import StatCard from "@/components/StateCard";

interface Contract {
  status: string;
  expiryDate: string;
  // Agregamos otros campos si es necesario para TS
}

const StatsGrid = ({ contracts }: { contracts: Contract[] }) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  // 1. Contratos que vencen en los próximos 30 días
  const expiringSoon = contracts.filter((c) => {
    const expiry = new Date(c.expiryDate);
    return expiry > now && expiry <= thirtyDaysFromNow;
  }).length;

  // 2. Contratos cuya fecha de vencimiento ya pasó
  const expired = contracts.filter((c) => new Date(c.expiryDate) < now).length;

  // 3. Contratos marcados explícitamente como "Active"
  const active = contracts.filter((c) => c.status === "Active").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard
        label="Por Vencer (30 días)"
        count={expiringSoon}
        color="bg-[#f2994a]" // Naranja del diseño
      />
      <StatCard
        label="Vencidos"
        count={expired}
        color="bg-[#eb5757]" // Rojo del diseño
      />
      <StatCard
        label="Activos"
        count={active}
        color="bg-[#27ae60]" // Verde del diseño
      />
    </div>
  );
};

export default StatsGrid;
