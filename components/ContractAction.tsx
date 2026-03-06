"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
  contractId: string;
  contractOwner: string;
}

const ContractAction = ({ contractId, contractOwner }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const role = user?.role;
  const userId = user?.id;

  console.log("userId:", userId);
  console.log("owner:", contractOwner);

  if (role === "employee" && userId != contractOwner) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de eliminar este contrato?",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        toast.success("Contract deleted successfully");
        router.push("/profile"); // Redirigimos al perfil tras borrar
        router.refresh(); // Limpiamos caché de Next.js
      } else {
        toast.error("Fail to delete contract");
      }
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error en la comunicación con el servidor");
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
        <FaTrash size={14} /> Delete
      </button>
    </div>
  );
};

export default ContractAction;
