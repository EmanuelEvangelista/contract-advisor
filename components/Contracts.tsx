"use client";
import ContractCard from "./ContractCard";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { ContractType } from "@/models/Contract";
import Pagination from "@/components/Pagination";
import { useSession } from "next-auth/react";
import ContractSearchForm from "@/components/ContractSearchForm";

const Contracts = () => {
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { data: session, status } = useSession();

  useEffect(() => {
    const getContracts = async () => {
      if (!session?.user?.id) {
        setContracts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/contracts?page=${page}&pageSize=${pageSize}`,
          { cache: "no-store" }, // Forzamos que no guarde basura en el navegador
        );

        if (res.ok) {
          const data = await res.json();
          setContracts(data.contracts);
          setTotalItems(data.total);
        } else {
          setContracts([]); // Si falla (ej. 401), vaciamos la lista
        }
      } catch (error) {
        console.log("Error fetching contracts", error);
      } finally {
        setLoading(false);
      }
    };

    getContracts();
  }, [page, pageSize, session?.user?.id]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // 2. Si NextAuth está cargando, mostramos el Spinner
  if (status === "loading") {
    return <Spinner loading={true} />;
  }

  // 3. SI NO HAY SESIÓN: Retornamos null (No renderiza nada en el HTML)
  if (!session) {
    return null;
  }

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="w-full">
      {/* Buscador */}
      <div className="mb-6 relative">
        <ContractSearchForm />
      </div>

      {/* Renderizado seguro */}
      {contracts.length === 0 ? (
        <p>No contracts found</p>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract: any) => (
            <ContractCard key={contract._id} contract={contract} />
          ))}
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
};

export default Contracts;
