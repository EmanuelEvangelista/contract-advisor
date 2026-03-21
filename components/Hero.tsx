"use client";
import {
  FaChartLine,
  FaBell,
  FaEnvelope,
  FaUserShield,
  FaSearch,
  FaCheckCircle,
  FaExchangeAlt,
  FaFileSignature,
} from "react-icons/fa";
import ButtonsDemo from "@/components/ButtonsDemo";

const Hero = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-14 pb-24 grid lg:grid-cols-2 gap-16 items-center">
      {/* ── LEFT ── */}
      <div className="space-y-7">
        <ButtonsDemo />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
          Agricultural Contract Platform
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-[3.4rem] font-black text-slate-900 leading-[1.06] tracking-tight">
            Every Agro-Contract.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600">Every Detail.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-0 rounded" />
            </span>
            <br />
            One Platform.
          </h1>
          <p className="text-base text-slate-500 max-w-md leading-relaxed">
            ContractAdvisor is a full-featured contract management system built
            for agricultural studios — with team messaging, role-based access,
            expiration alerts, and complete staff oversight.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <FaChartLine />,
              label: "Live Dashboard",
              sub: "Stats at a glance",
            },
            {
              icon: <FaEnvelope />,
              label: "Contract Chat",
              sub: "Internal messaging",
            },
            {
              icon: <FaBell />,
              label: "Expiry Alerts",
              sub: "Email via Resend",
            },
            {
              icon: <FaExchangeAlt />,
              label: "Reassignment",
              sub: "Flexible team ops",
            },
            {
              icon: <FaSearch />,
              label: "Search & Pagination",
              sub: "Find anything fast",
            },
            {
              icon: <FaUserShield />,
              label: "Staff Control",
              sub: "Deactivate, audit-safe",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="text-blue-500 text-base shrink-0">{f.icon}</div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {f.label}
                </p>
                <p className="text-[11px] text-slate-400">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Roles */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
            Roles:
          </span>
          {["Admin / Accountant", "Employee"].map((role, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-slate-900 text-white rounded-full"
            >
              <FaCheckCircle className="text-blue-400" />
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Stacked Cards ── */}
      <div className="hidden lg:flex items-center justify-center relative h-[540px]">
        {/* Glow */}
        <div className="absolute inset-0 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

        {/* ── CARD 3 — Staff (fondo) ── */}
        <div className="absolute top-12 right-0 w-72 rotate-6 scale-95 opacity-60">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                Staff Management
              </span>
            </div>
            <div className="p-4 space-y-2">
              {[
                { name: "Carlos Méndez", role: "Admin", active: true },
                { name: "María López", role: "Employee", active: true },
                { name: "Juan Torres", role: "Employee", active: false },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white ${s.active ? "bg-blue-500" : "bg-slate-300"}`}
                    >
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {s.name}
                      </p>
                      <p className="text-[9px] text-slate-400">{s.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CARD 2 — Chat (medio) ── */}
        <div className="absolute top-6 left-0 w-72 -rotate-3 scale-[0.97] opacity-80">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                Contract Chat
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <FaFileSignature className="text-blue-500 text-xs shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-800">
                    Annual Leasing – Diego e Hijos
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Pedro Garcia · Exp. 16/4/2026
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-end">
                  <div className="w-6 h-6 rounded-full bg-slate-300 shrink-0" />
                  <div className="bg-slate-100 text-slate-700 text-[10px] px-3 py-1.5 rounded-2xl rounded-tl-none max-w-[160px]">
                    Q1 payment hasn't been registered. Can you check?
                  </div>
                </div>
                <div className="flex gap-2 items-end flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-blue-400 shrink-0" />
                  <div className="bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-2xl rounded-tr-none max-w-[140px]">
                    On it — I'll update the ledger today.
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] text-slate-300">
                  Write a message...
                </div>
                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold">
                  Send
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 1 — Dashboard (frente) ── */}
        <div className="relative w-80 z-10 shadow-2xl rounded-2xl">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Contracts Dashboard
              </span>
              <div className="w-8" />
            </div>
            <div className="p-4 bg-slate-50 space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Expiring Soon",
                    value: "3",
                    color: "text-amber-500",
                    bg: "bg-amber-50 border-amber-100",
                  },
                  {
                    label: "Expired",
                    value: "0",
                    color: "text-red-500",
                    bg: "bg-red-50 border-red-100",
                  },
                  {
                    label: "Active",
                    value: "4",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50 border-emerald-100",
                  },
                ].map((stat, i) => (
                  <div key={i} className={`rounded-xl p-3 border ${stat.bg}`}>
                    <p className={`text-xl font-black ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contract list */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    Recent Contracts
                  </span>
                  <span className="text-[9px] text-blue-600 font-bold">
                    View all →
                  </span>
                </div>
                {[
                  {
                    name: "Pedro Garcia",
                    type: "Parcelary",
                    expiry: "16/4/2026",
                    status: "Active",
                    dot: true,
                  },
                  {
                    name: "Franco Perez",
                    type: "Leasing",
                    expiry: "3/5/2026",
                    status: "Active",
                    dot: false,
                  },
                  {
                    name: "Ricardo Garcia",
                    type: "Parcelary",
                    expiry: "30/3/2026",
                    status: "Expiring",
                    dot: false,
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 border-b border-slate-50 last:border-0 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {c.dot && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">
                          {c.name}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          {c.type} · {c.expiry}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        c.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Alert */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                <FaBell className="text-amber-400 text-xs shrink-0" />
                <p className="text-[10px] text-amber-700 font-semibold">
                  Ricardo Garcia's contract expires in 10 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
