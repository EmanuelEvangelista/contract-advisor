"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchContract } from "@/utils/request";
import { ContractType } from "@/models/Contract";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import ContractDetails from "@/components/ContractDetails";
import AssigneeSelector from "@/components/AssigneeSelector";
import { useSession } from "next-auth/react";

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const [contract, setContract] = useState<ContractType | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. DECLARAR LA FUNCIÓN AQUÍ (Fuera del useEffect)
  const fetchContractData = async () => {
    if (!id) return;
    try {
      // Usamos la función importada 'fetchContract' (la del utils)
      const data = await fetchContract(id);
      setContract(data);
    } catch (error) {
      console.error("Error fetching Contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. EL EFECTO SOLO LLAMA A LA FUNCIÓN
  useEffect(() => {
    fetchContractData();
  }, [id]);

  if (loading) return <Spinner loading={loading} />;

  if (!contract)
    return (
      <h1 className="p-8 text-center text-3xl font-bold text-red-500">
        Contract not found.
      </h1>
    );

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && contract && (
        <>
          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/contracts"
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Contracts
              </Link>
            </div>
          </section>

          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6 max-w-5xl mx-auto">
                {/* Columna principal con los detalles */}
                <div className="md:col-span-1">
                  <ContractDetails contract={contract} />
                </div>

                {/* Sidebar o sección de acciones: Aquí validamos el rol */}
                <div className="space-y-4">
                  {session?.user?.role === "accountant" && (
                    <AssigneeSelector
                      contractId={contract._id.toString()}
                      currentOwnerId={contract.owner.toString()}
                      studioId={session?.user?.studioId?.toString() || ""}
                      onUpdate={fetchContractData}
                    />
                  )}

                  {/* Otros controles laterales si hicieran falta */}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ContractPage;
