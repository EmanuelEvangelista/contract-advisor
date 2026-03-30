"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ContractFormType } from "@/types/contract";

interface Props {
  contractId: string;
  contractOwner: string;
  contract: ContractFormType;
}

const ContractAction = ({ contract, contractId, contractOwner }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const role = user?.role;
  const userId = user?.id;

  if (session?.user.studioId !== contract?.studioId) {
    return null;
  }

  if (role === "employee" && userId != contractOwner) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contract?",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        toast.success("Contract deleted successfully");
        router.push("/contracts");
        router.refresh(); // Limpiamos caché de Next.js
      } else {
        toast.error("Fail to delete contract");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error in the communication with the server");
    }
  };

  return (
    <div className="container m-auto px-6 py-4 flex justify-end gap-3">
      <Link
        href={`/contracts/${contractId}/edit`}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md text-sm"
      >
        <FaEdit size={14} /> Edit
      </Link>

      <button
        onClick={handleDelete}
        className="flex items-center gap-2 bg-white border border-rose-200 text-rose-600 px-6 py-2 rounded-xl font-bold hover:bg-rose-50 transition-all text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default ContractAction;
