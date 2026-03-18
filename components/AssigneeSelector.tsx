"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserEdit, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Member {
  _id: string;
  name?: string;
  username?: string;
  role: string;
}

interface Props {
  contractId: string;
  currentOwnerId: string;
  studioId: string | null;
  onUpdate: () => void;
}

const AssigneeSelector = ({
  contractId,
  currentOwnerId,
  studioId,
  onUpdate,
}: Props) => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedOwner, setSelectedOwner] = useState(currentOwnerId);
  const [savedOwner, setSavedOwner] = useState(currentOwnerId);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  if (
    session?.user.studioId !== studioId ||
    session?.user?.role !== "accountant"
  ) {
    return null;
  }

  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await fetch(`/api/studio/${studioId}/members`);
        const json = await res.json();
        setMembers(json);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    if (studioId) getMembers();
  }, [studioId]);

  //cuando el padre se actualice, el selector también resetee sus estados de "guardado".
  useEffect(() => {
    if (currentOwnerId) {
      setSelectedOwner(currentOwnerId);
      setSavedOwner(currentOwnerId); // Esto hace que hasChanges sea FALSE de nuevo
    }
  }, [currentOwnerId]);

  const handleSave = async () => {
    // Si no cambió nada, no hacemos la petición
    if (selectedOwner === savedOwner) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/reassign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOwnerId: selectedOwner }),
      });

      if (res.ok) {
        setSavedOwner(selectedOwner); // Actualizamos el estado de "guardado"
        toast.success("Responsible party updated correctly");
        onUpdate();
      } else {
        toast.error("Error reassigning contract");
      }
    } catch (error) {
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Verificamos si hay cambios pendientes para mostrar el botón
  const hasChanges = selectedOwner !== savedOwner;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mt-6">
      <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
        <FaUserEdit className="text-indigo-600" /> Reassign Responsible
      </label>

      <div className="flex flex-col gap-3">
        <select
          value={selectedOwner}
          onChange={(e) => setSelectedOwner(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name || member.username || "Usuario"} (
              {member.role === "accountant" ? "Contador" : "Empleado"})
            </option>
          ))}
        </select>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
              loading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {loading ? (
              "Guardando..."
            ) : (
              <>
                <FaCheck /> Confirm Change
              </>
            )}
          </button>
        )}
      </div>

      {!hasChanges && (
        <p className="text-[10px] text-slate-400 mt-2 italic text-center">
          Select a team member to reassign.
        </p>
      )}
    </div>
  );
};

export default AssigneeSelector;
