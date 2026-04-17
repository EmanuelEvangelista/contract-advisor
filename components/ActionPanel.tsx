// components/ActionPanel.tsx
"use client";
import Link from "next/link";
import { FaPlus, FaFileAlt, FaCheckSquare, FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ExpiryTestButton from "@/components/ExpiryTestButton";

const ActionPanel = () => {
  const { data: session } = useSession();

  const role = session?.user.role === "accountant";

  useEffect(() => {
    if (session?.user) {
      // 👈 La lógica condicional va ADENTRO del Hook
      fetch("/api/contracts/check-expiring");
    }
  }, [session?.user]);

  if (!session) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Bloque 2: Gestión de Personal (Solo visible para contador según tu lógica) */}
      {role && (
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
          <h3 className="text-[10px] font-black text-slate-500 mb-4 tracking-[0.15em] uppercase">
            Administration
          </h3>
          <Link
            href={"/studio/employees"}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 border border-slate-700"
          >
            <FaUser className="text-indigo-400" size={16} />
            Staff Management
          </Link>
          <p className="text-[10px] text-slate-500 mt-3 text-center italic">
            Exclusive access for accountants
          </p>
        </div>
      )}

      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
        <h3 className="text-sm font-semibold text-indigo-900 mb-2">
          📧 Automated Expiry Alerts
        </h3>
        <p className="text-xs text-indigo-700 mb-3">
          Contracts expiring within 15 days automatically trigger email
          notifications to the contract owner via Resend.
        </p>
        <div className="flex items-center gap-2 bg-white border border-indigo-100 rounded-lg px-3 py-2">
          <span className="text-xs text-emerald-600 font-bold">✅ Active</span>
          <span className="text-xs text-slate-400">
            — running on contract check cycle
          </span>
        </div>
      </div>

      {/* Bloque 3: Plantillas Recientes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <FaFileAlt className="text-indigo-600" size={12} />
          <h3 className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">
            Recent Templates
          </h3>
        </div>

        <ul className="space-y-3">
          {[
            { id: 1, name: "Servicios Estándar" },
            { id: 2, name: "Laboral - Indefinido" },
          ].map((template) => (
            <li
              key={template.id}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-indigo-500 p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <FaCheckSquare size={14} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {template.name}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <button className="w-full mt-6 py-3 text-[11px] font-black text-slate-400 border-2 border-dashed border-slate-100 rounded-xl hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all uppercase tracking-widest">
          See all templates
        </button>
      </div>
    </section>
  );
};

export default ActionPanel;
