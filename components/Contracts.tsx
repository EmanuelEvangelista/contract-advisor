"use client";
import ContractCard from "./ContractCard";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { ContractType } from "@/models/Contract";
import Pagination from "@/components/Pagination";
import { useSession } from "next-auth/react";
import ContractSearchForm from "@/components/ContractSearchForm";
import Link from "next/link";

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

  const handlePageChange = (newPage: any) => {
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

  if (contracts.length === 0) {
    return loading ? (
      <Spinner loading={loading} />
    ) : (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800">
          There are no contracts yet
        </h3>
        <p className="text-slate-500 mb-6">
          Start by loading the first one for your study.
        </p>
        <Link
          href="/contracts/add"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold"
        >
          + Create First Contract
        </Link>
      </div>
    );
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
