"use client";
import ContractCard from "./ContractCard";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { ContractType } from "@/models/Contract";
import Pagination from "@/components/Pagination";

const Contracts = () => {
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const getContracts = async () => {
      try {
        const res = await fetch(
          `/api/contracts?page=${page}&pageSize=${pageSize}`,
        );

        if (res.ok) {
          const data = await res.json();
          setContracts(data.contracts);
          setTotalItems(data.total);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.log("Error fetching contracts", error);
      } finally {
        setLoading(false);
      }
    };
    getContracts();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="w-full">
      {/* Buscador */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <FaSearch size={16} />
        </div>
        <input
          type="text"
          placeholder="Buscar contratos..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
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
