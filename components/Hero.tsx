"use client";
import {
  FaShieldAlt,
  FaChartLine,
  FaFileSignature,
  FaBell,
  FaEnvelope,
  FaUserShield,
  FaSearch,
  FaCheckCircle,
  FaExchangeAlt,
} from "react-icons/fa";
import { useState } from "react";
import ButtonsDemo from "@/components/ButtonsDemo";

const contracts = [
  {
    name: "Pedro Garcia",
    contract: "Annual Leasing – Diego e Hijos",
    type: "Parcelary",
    expiry: "16/4/2026",
    status: "Active",
    hasMessage: true,
  },
  {
    name: "Franco Perez",
    contract: "Annual Leasing – Diego e Hijos",
    type: "Leasing",
    expiry: "3/5/2026",
    status: "Active",
    hasMessage: false,
  },
  {
    name: "Ricardo Garcia",
    contract: "Annual Parcery Raul and Co.",
    type: "Parcelary",
    expiry: "30/3/2026",
    status: "Expiring",
    hasMessage: false,
  },
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat">("dashboard");

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

        {/* Roles pill row */}
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

      {/* ── RIGHT — App Mockup ── */}
      <div className="hidden lg:block relative">
        {/* Glow */}
        <div className="absolute inset-0 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Fake browser bar */}
          <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              contractadvisor.vercel.app
            </div>
            <div className="w-16" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-white">
            {(["dashboard", "chat"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "dashboard" ? "📊 Dashboard" : "💬 Contract Chat"}
              </button>
            ))}
          </div>

          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <div className="p-5 bg-slate-50 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Upcoming Expirations",
                    value: "3",
                    color: "text-amber-500",
                    bg: "bg-amber-50 border-amber-100",
                  },
                  {
                    label: "Expired Contracts",
                    value: "0",
                    color: "text-red-500",
                    bg: "bg-red-50 border-red-100",
                  },
                  {
                    label: "Active Contracts",
                    value: "4",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50 border-emerald-100",
                  },
                ].map((stat, i) => (
                  <div key={i} className={`rounded-2xl p-4 border ${stat.bg}`}>
                    <p className={`text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Search bar */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <FaSearch className="text-slate-300 text-xs" />
                <span className="text-xs text-slate-300">
                  Search contracts...
                </span>
              </div>

              {/* Contract list */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Recent Contracts
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold">
                    View all →
                  </span>
                </div>
                {contracts.map((c, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 border-b border-slate-50 last:border-0 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {c.hasMessage && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {c.type} · {c.expiry}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
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

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                {["←", "1", "2", "3", "→"].map((p, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                      p === "1"
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white border border-slate-200 text-slate-500"
                    }`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAT TAB ── */}
          {activeTab === "chat" && (
            <div className="p-5 bg-slate-50 space-y-3">
              {/* Contract context */}
              <div className="bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <FaFileSignature className="text-blue-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    Annual Leasing – Diego e Hijos
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Pedro Garcia · Parcelary · Exp. 16/4/2026
                  </p>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                  Active
                </span>
              </div>

              {/* Chat window */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    💬 Internal Chat
                  </span>
                </div>
                <div className="p-4 space-y-4 h-44">
                  {/* Message from other */}
                  <div className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full bg-slate-300 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 mb-1 px-1">
                        Carlos (Admin)
                      </p>
                      <div className="bg-slate-100 text-slate-700 text-xs px-3 py-2 rounded-2xl rounded-tl-none max-w-[180px]">
                        The payment for Q1 hasn't been registered yet. Can you
                        check?
                      </div>
                    </div>
                  </div>
                  {/* Message from me */}
                  <div className="flex gap-2 items-end flex-row-reverse">
                    <div className="w-7 h-7 rounded-full bg-blue-400 shrink-0" />
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] text-slate-400 mb-1 px-1">Tú</p>
                      <div className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none max-w-[180px]">
                        On it — I'll update the ledger today.
                      </div>
                    </div>
                  </div>
                  {/* Reassignment notification */}
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                    <FaBell className="text-blue-400 text-xs shrink-0" />
                    <p className="text-[10px] text-blue-700 font-semibold">
                      Contract reassigned to María López
                    </p>
                  </div>
                </div>
                {/* Input */}
                <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-300">
                    Write a message...
                  </div>
                  <div className="bg-emerald-500 text-white px-3 py-2 rounded-xl text-[11px] font-bold">
                    Send
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Hero;
