"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function ButtonsDemo() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (email: string, role: string) => {
    setLoading(role);
    await signIn("credentials", {
      email: email,
      password: "password123",
      role: role,
      callbackUrl: "/panel",
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() =>
            handleLogin("demo-reclutador@contractadvisor.com", "accountant")
          }
          disabled={!!loading}
          className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
        >
          {loading === "accountant" ? "Get in..." : "Demo Accountant/Admin"}
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() =>
            handleLogin("employee-demo@contractadvisor.com", "employee")
          }
          disabled={!!loading}
          className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
        >
          {loading === "employee" ? "Logging in..." : "Demo Employee"}
        </button>
      </div>
      <p className="text-xs text-slate-400 italic">
        * Instant access without registration. Try the features now.
      </p>
    </>
  );
}
