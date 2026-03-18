"use client";
import { fetchContract } from "@/utils/request";
import Link from "next/link";
import {
  FaArrowLeft,
  FaFileContract,
  FaCalendarAlt,
  FaUser,
  FaSeedling,
  FaFilePdf,
  FaExternalLinkAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { ContractFormType } from "@/types/contract";
import { useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import AssigneeSelector from "@/components/AssigneeSelector";
import { useRouter } from "next/navigation";
import ContractChat from "@/components/ContractChat";
import ContractAction from "@/components/ContractAction";

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [contract, setContract] = useState<ContractFormType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContractData = async () => {
      if (!id) return;
      try {
        const data = await fetchContract(id);
        setContract(data);
        router.refresh();
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);

  useEffect(() => {
    const markAsRead = async () => {
      if (!id) return;

      try {
        await fetch("/api/messages/mark-as-read", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contractId: id }),
        });

        // Esto refresca los datos del servidor para que la campana
        // del Navbar se entere de que ya no hay mensajes nuevos
        router.refresh();
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markAsRead();
  }, [id, router]);

  if (loading) return <Spinner loading={loading} />;

  if (!contract)
    return (
      <div className="p-10 text-center font-bold text-slate-600">
        Contrato no encontrado
      </div>
    );

  const onUpdate = async () => {
    setLoading(true); // Opcional: mostrar spinner mientras refresca
    try {
      const data = await fetchContract(id);
      setContract(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    } catch (error) {
      console.error("Error al refrescar:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ===== CALCULO VENCIMIENTO ===== */

  const today = new Date();
  const expiry = new Date(contract.expiryDate);

  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let expiryColor = "bg-green-100 text-green-700";

  if (diffDays <= 30 && diffDays > 7) {
    expiryColor = "bg-amber-100 text-amber-700";
  }

  if (diffDays <= 7) {
    expiryColor = "bg-red-100 text-red-700";
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/contracts"
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600"
          >
            <FaArrowLeft /> Back
          </Link>

          <div className="flex gap-3">
            <ContractAction
              contractId={id}
              contractOwner={contract.owner}
              contract={contract}
            />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
        {/* ===== VENCIMIENTO ===== */}

        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 text-white p-3 rounded-xl">
              <FaFileContract size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {contract.contractName}
              </h1>

              <p className="text-sm text-slate-500">
                Type of contract: {contract.contractType}
              </p>

              {/* EMPLEADO RESPONSABLE */}

              {contract.assignedEmployee?.name && (
                <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-indigo-600">
                  <FaUser />
                  Responsible: {contract.assignedEmployee.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${expiryColor}`}
            >
              Expires in {diffDays} days
            </span>

            <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <FaCalendarAlt />
              {expiry.toLocaleDateString("es-AR")}
            </span>
          </div>
        </section>
        {/* GRID */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PARTES */}

          <InfoCard title="Intervinientes" icon={<FaUser />}>
            <DataLine
              label="Contratante"
              value={contract.contractor_details?.name}
            />

            <DataLine
              label="Email"
              value={contract.contractor_details?.email}
            />

            <DataLine
              label="Contratado"
              value={contract.contractee_details?.name}
              highlight
            />

            <DataLine
              label="Email"
              value={contract.contractee_details?.email}
            />

            <DataLine
              label="Teléfono"
              value={contract.contractee_details?.phone}
            />
          </InfoCard>

          {/* COMERCIAL */}

          <InfoCard title="Condición Comercial" icon={<FaMoneyBillWave />}>
            <DataLine label="Método de pago" value={contract.paymentMethod} />

            {contract.paymentMethod === "In-Kind" ? (
              <>
                <DataLine
                  label="Commodity"
                  value={contract.paymentDetails?.commodity}
                />

                <DataLine
                  label="Cantidad"
                  value={contract.paymentDetails?.quantity}
                />

                <DataLine
                  label="Unidad"
                  value={contract.paymentDetails?.unit}
                />
              </>
            ) : (
              <>
                <DataLine
                  label="Monto"
                  value={`${contract.paymentDetails?.currency} ${contract.paymentDetails?.amount}`}
                />
              </>
            )}

            <DataLine
              label="Frecuencia"
              value={contract.paymentDetails?.frequency}
            />
          </InfoCard>

          {/* AGRO */}

          <InfoCard title="Datos Agro / Servicio" icon={<FaSeedling />}>
            <DataLine
              label="Localidad"
              value={contract.agroDetails?.location}
            />

            <DataLine label="Superficie" value={contract.agroDetails?.area} />

            <DataLine label="Cultivo" value={contract.agroDetails?.cropType} />

            <DataLine
              label="Equipo"
              value={contract.agroDetails?.equipmentModel}
            />

            <DataLine
              label="Seguro incluido"
              value={contract.agroDetails?.insuranceIncluded ? "Sí" : "No"}
            />
          </InfoCard>
        </section>

        {/* FECHAS */}

        <InfoCard title="Fechas del contrato" icon={<FaClock />}>
          <DataLine
            label="Inicio"
            value={new Date(contract.startDate).toLocaleDateString("es-AR")}
          />

          <DataLine
            label="Vencimiento"
            value={new Date(contract.expiryDate).toLocaleDateString("es-AR")}
          />

          <DataLine
            label="Creado"
            value={
              contract.createdAt
                ? new Date(contract.createdAt).toLocaleDateString("es-AR")
                : "N/A"
            }
          />

          <DataLine
            label="Última actualización"
            value={
              contract.updatedAt
                ? new Date(contract.updatedAt).toLocaleDateString("es-AR")
                : "N/A"
            }
          />
        </InfoCard>

        {/* EMPLEADO */}

        <InfoCard title="Empleado asignado" icon={<FaUser />}>
          <DataLine label="Nombre" value={contract.assignedEmployee?.name} />

          <DataLine label="Email" value={contract.assignedEmployee?.email} />

          <DataLine label="Rol" value={contract.assignedEmployee?.role} />
        </InfoCard>

        {/* PDF */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-3 border-b bg-slate-50">
            <h3 className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase">
              <FaFilePdf className="text-red-500" />
              Document
            </h3>

            {typeof contract.pdfs?.[0] === "string" && (
              <a
                href={contract.pdfs[0]}
                target="_blank"
                className="text-xs font-bold text-indigo-600 flex items-center gap-1"
              >
                View PDF
              </a>
            )}
          </div>

          <div className="h-[320px] bg-slate-200">
            {contract.pdfs?.[0] ? (
              <iframe
                src={`${contract.pdfs[0]}#toolbar=0`}
                className="w-full h-full"
                title="PDF"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No PDF loaded
              </div>
            )}
          </div>
        </section>

        {/* NOTAS */}

        {contract.notes && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-black text-amber-600 uppercase mb-1">
              Observaciones
            </p>

            <p className="text-sm text-amber-900">{contract.notes}</p>
          </section>
        )}
        <ContractChat contract={contract} />
        <AssigneeSelector
          contractId={contract._id!}
          currentOwnerId={contract.owner?._id || contract.owner}
          studioId={contract.studioId}
          onUpdate={onUpdate}
        />
      </main>
    </div>
  );
};

/* COMPONENTES */

const InfoCard = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
    <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-4">
      {icon} {title}
    </h3>

    <div className="space-y-3">{children}</div>
  </div>
);

const DataLine = ({ label, value, highlight = false }: any) => (
  <div>
    <span className="text-[10px] font-black text-slate-400 uppercase block mb-0.5">
      {label}
    </span>

    <p
      className={`text-sm font-bold ${
        highlight ? "text-indigo-600" : "text-slate-800"
      }`}
    >
      {value || <span className="text-slate-300 italic">N/A</span>}
    </p>
  </div>
);

export default ContractPage;
