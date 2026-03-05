"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { FaFileContract, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;
  const profileRole = session?.user?.role;

  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserContracts = async () => {
      // Determinamos el ID a usar según el rol
      const identifier =
        profileRole === "accountant"
          ? session?.user?.studioId
          : session?.user?.id;

      if (!identifier) return;

      try {
        const res = await fetch(`/api/contracts/user/${identifier}`);
        if (res.status === 200) {
          const data = await res.json();
          setContracts(data);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast.error("Could not load contracts");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchUserContracts();
    }
  }, [session, profileRole]);

  const handleDeleteContract = async (contractId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contract?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        // Remove the property from state
        const updatedContracts = contracts.filter(
          (contract) => contract._id !== contractId,
        );

        setContracts(updatedContracts);

        toast.success("Contract deleted");
      } else {
        toast.error("Failed to delete contract");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete contract");
    }
  };

  return (
    <section className="bg-slate-50 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* CABECERA: INFO DE USUARIO COMPACTA */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 mb-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              className="h-12 w-12 rounded-full border-2 border-indigo-100 object-cover"
              src={profileImage || profileDefault}
              width={50}
              height={50}
              alt="User"
            />
            <div>
              <h2 className="text-lg font-black text-slate-800 leading-none">
                {profileName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {profileEmail}
              </p>
            </div>
            <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {profileRole}
            </span>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              Panel de Gestión
            </p>
            <p className="text-xs text-slate-600 font-semibold">
              Contract Advisor v1.0
            </p>
          </div>
        </div>

        {/* SECCIÓN PRINCIPAL: LISTADO DE CONTRATOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <FaFileContract className="text-indigo-600" /> My Contracts
            </h1>
            <span className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
              {contracts.length} Total
            </span>
          </div>

          {loading ? (
            <Spinner loading={loading} />
          ) : contracts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
              <p className="text-slate-400 font-medium italic">
                No contracts found in your account.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {contracts.map((contract) => (
                <div
                  key={contract._id}
                  className="group bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-indigo-300 transition-all flex flex-col lg:flex-row lg:items-center gap-6"
                >
                  {/* 1. Icono/Miniatura */}
                  <div className="flex-shrink-0 h-14 w-14 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                    {contract.pdfs?.[0] ? (
                      <img
                        src={contract.pdfs[0].replace(/\.pdf$/, ".jpg")}
                        alt="doc"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <FaFileContract size={20} className="text-slate-300" />
                    )}
                  </div>

                  {/* 2. Información Principal (Expandida) */}
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                        Nombre del Contrato
                      </p>
                      <p className="text-base font-black text-slate-800 truncate">
                        {contract.contractName}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Tipo y Categoría
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">
                          {contract.contractType}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Estado Operativo
                      </p>
                      <div>
                        <span
                          className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
                            contract.status === "Active"
                              ? "text-emerald-700 bg-emerald-100"
                              : "text-amber-700 bg-amber-100"
                          }`}
                        >
                          {contract.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Acciones (Estilo Botonera) */}
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl lg:bg-transparent">
                    <Link
                      href={`/contracts/${contract._id}`}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-xs font-bold"
                    >
                      <FaEye size={14} /> <span className="lg:hidden">Ver</span>
                    </Link>
                    <Link
                      href={`/contracts/${contract._id}/edit`}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-xs font-bold"
                    >
                      <FaEdit size={14} />{" "}
                      <span className="lg:hidden">Editar</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteContract(contract._id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-xs font-bold"
                    >
                      <FaTrash size={14} />{" "}
                      <span className="lg:hidden">Borrar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
