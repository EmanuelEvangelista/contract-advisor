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
    <section className="bg-slate-50 min-h-screen">
      <div className="container m-auto py-12 px-4 md:px-0">
        <div className="bg-white px-8 py-10 mb-4 shadow-sm rounded-3xl border border-slate-100">
          <h1 className="text-3xl font-black text-slate-900 mb-8">
            User Profile
          </h1>

          <div className="flex flex-col md:flex-row gap-12">
            {/* LADO IZQUIERDO: INFO USUARIO */}
            <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0">
              <div className="relative mb-6">
                <Image
                  className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-lg object-cover"
                  src={profileImage || profileDefault}
                  width={200}
                  height={200}
                  alt="User"
                />
                <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                  {profileRole}
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800">
                  {profileName}
                </h2>
                <p className="text-slate-500 font-medium">{profileEmail}</p>
              </div>
            </div>

            {/* LADO DERECHO: LISTADO DE CONTRATOS */}
            <div className="md:w-2/3">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FaFileContract className="text-indigo-600" /> Your Contracts
              </h2>

              {loading ? (
                <Spinner loading={loading} />
              ) : contracts.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                  <p className="text-slate-400 font-medium">
                    No contracts found in your account.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div
                      key={contract._id}
                      className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Miniatura del PDF o Icono */}
                        <div className="h-20 w-20 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-50">
                          {contract.pdfs?.[0] ? (
                            <img
                              src={contract.pdfs[0].replace(/\.pdf$/, ".jpg")}
                              alt="preview"
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <FaFileContract
                              size={24}
                              className="text-slate-300"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-800 leading-tight">
                            {contract.contractName}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                              {contract.contractType}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${contract.status === "Active" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}
                            >
                              {contract.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                        <Link
                          href={`/contracts/${contract._id}`}
                          className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </Link>
                        <Link
                          href={`/contracts/${contract._id}/edit`}
                          className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Contract"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteContract(contract._id)}
                          className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          type="button"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
