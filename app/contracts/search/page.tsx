"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaFileContract, FaSearch } from "react-icons/fa";
import ContractCard from "@/components/ContractCard";
import Spinner from "@/components/Spinner";
import ContractSearchForm from "@/components/ContractSearchForm";
import { searchContracts } from "@/utils/request";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const employee = searchParams.get("employee") || "";
  const type = searchParams.get("type") || "All";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await searchContracts({ keyword, employee, type });
        console.log(data);
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
    <div className="min-h-screen bg-[#f8fafc] w-full">
      {/* Header: Ocupa todo el ancho */}
      <section className="bg-slate-900 py-10 shadow-lg w-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <FaSearch size={10} /> Panel de búsqueda
            </h2>
            <ContractSearchForm />
          </div>
        </div>
      </section>

      {/* Cuerpo Principal */}
      <main className="container mx-auto px-4 md:px-6 py-12">
        {/* Cabecera de resultados */}
        <div className="flex flex-col gap-6 mb-12">
          <Link
            href="/contracts"
            className="group inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold text-sm transition-all"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al listado
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <span className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200">
                <FaFileContract size={24} />
              </span>
              Resultados
            </h1>

            {!loading && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-slate-600 font-bold text-sm">
                  {contracts.length}{" "}
                  {contracts.length === 1 ? "resultado" : "resultados"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Zona de Cards: Aquí está la corrección del ancho */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner loading={loading} />
            <p className="mt-4 text-slate-400 font-bold text-sm tracking-widest uppercase italic">
              Buscando...
            </p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 md:p-24 text-center">
            <div className="text-slate-200 flex justify-center mb-6">
              <FaSearch size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              No hay coincidencias
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
              No encontramos contratos para{" "}
              <span className="text-indigo-600">
                "{keyword || employee || type}"
              </span>
              .
            </p>
            <Link
              href="/contracts"
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 inline-block"
            >
              Resetear filtros
            </Link>
          </div>
        ) : (
          <div>
            {contracts.map((contract) => (
              <ContractCard key={contract._id} contract={contract} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
