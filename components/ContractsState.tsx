import StatCard from "@/components/StateCard";
import { fetchContracts } from "@/utils/request";
import { getSessionUser } from "@/utils/getSessionUser";
import Link from "next/link";

const ContractsState = async () => {
  // 1. Obtenemos el usuario de la sesión para filtrar las estadísticas
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return null;
  }

  // 2. Traemos solo los contratos que le pertenecen (usando la lógica de la API que creamos)
  // Si es contador, pasamos studioId; si no, userId.
  const identifier = sessionUser.user.studioId;

  // 1. Obtenemos los datos
  const rawData: any = await fetchContracts(identifier);

  const data = Array.isArray(rawData) ? rawData : rawData?.contracts || [];

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Medianoche de hoy

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  // 1. VENCIDOS: La fecha ya pasó (independientemente del status)
  const expired = data.filter((c: any) => {
    const expiry = new Date(c.expiryDate);
    expiry.setMinutes(expiry.getMinutes() + expiry.getTimezoneOffset());
    expiry.setHours(0, 0, 0, 0);
    return expiry < now;
  }).length;

  // 2. PRÓXIMOS A VENCER: Están por vencer en los próximos 30 días pero aún NO vencieron
  const expiringSoon = data.filter((c: any) => {
    const expiry = new Date(c.expiryDate);
    expiry.setMinutes(expiry.getMinutes() + expiry.getTimezoneOffset());
    expiry.setHours(0, 0, 0, 0);
    return expiry >= now && expiry <= thirtyDaysFromNow;
  }).length;

  // 3. ACTIVOS REALES: Tienen status "Active" Y además su fecha de vencimiento es HOY O FUTURA
  const active = data.filter((c: any) => {
    const expiry = new Date(c.expiryDate);
    expiry.setMinutes(expiry.getMinutes() + expiry.getTimezoneOffset());
    expiry.setHours(0, 0, 0, 0);

    return c.status === "Active" && expiry >= now;
  }).length;

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard de Contratos
        </h1>
        <p className="text-slate-500 mt-1">
          Estado actual de tus gestiones parcelarias y arrendamientos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href={"/contracts"} target="_blank" rel="noopener noreferrer">
          <StatCard
            label="Próximos Vencimientos"
            count={expiringSoon}
            color="bg-amber-500" // Naranja/Ambar
          />
        </Link>
        <Link href={"/contracts"} target="_blank" rel="noopener noreferrer">
          <StatCard
            label="Contratos Vencidos"
            count={expired}
            color="bg-rose-500" // Rojo/Rose
          />
        </Link>
        <Link href={"/contracts"} target="_blank" rel="noopener noreferrer">
          <StatCard
            label="Contratos Activos"
            count={active}
            color="bg-emerald-500" // Verde/Esmeralda
          />
        </Link>
      </div>
    </section>
  );
};

export default ContractsState;
