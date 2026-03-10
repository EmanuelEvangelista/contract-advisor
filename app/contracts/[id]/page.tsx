"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft, FaFileContract } from "react-icons/fa";
import ContractCard from "@/components/ContractCard";
import Spinner from "@/components/Spinner";
import ContractSearchForm from "@/components/ContractSearchForm";
import { searchContracts } from "@/utils/request"; // 👈 importamos el helper

const SearchResultsPage = () => {
  const searchParams = useSearchParams();

  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtenemos los filtros
  const keyword = searchParams.get("keyword") || "";
  const employee = searchParams.get("employee") || "";
  const type = searchParams.get("type") || "All";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // 👇 usamos el helper en vez de fetch manual
        const data = await searchContracts({ keyword, employee, type });
        setContracts(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, employee, type]);

  return (
    <>
      <section className="bg-slate-900 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContractSearchForm />
        </div>
      </section>

      <section className="px-4 py-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl m-auto">
          <Link
            href="/contracts"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold mb-6 transition-colors"
          >
            <FaArrowAltCircleLeft className="mr-2" /> Volver a Contratos
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <FaFileContract className="text-indigo-600" />
              Resultados de Búsqueda
            </h1>
            <span className="bg-white border border-slate-200 text-slate-600 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
              {contracts.length} encontrados
            </span>
          </div>

          {loading ? (
            <Spinner loading={loading} />
          ) : contracts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <p className="text-slate-500 text-lg font-medium italic">
                No se encontraron contratos que coincidan con tu búsqueda.
              </p>
              <Link
                href="/contracts"
                className="mt-4 inline-block text-indigo-600 font-bold underline"
              >
                Ver todos los contratos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map((contract) => (
                <ContractCard key={contract._id} contract={contract} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
