"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  FaShieldAlt,
  FaChartLine,
  FaFileSignature,
  FaArrowRight,
} from "react-icons/fa";

const Hero = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (email: string, role: string) => {
    setLoading(role);
    await signIn("credentials", {
      email: email,
      password: "password123",
      callbackUrl: "/panel",
    });
  };

  return (
    <>
      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
            Smart Management for the Agro World
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
            Unlock the Power of <br />
            <span className="text-blue-600">Smart Contract</span> Management
          </h1>
          <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
            Automate, track, and optimize your agricultural agreements with
            ease. The all-in-one platform for modern producers and contractors.
          </p>

          {/* --- BOTONERA DE DEMO --- */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() =>
                handleLogin("demo-reclutador@contractadvisor.com", "accountant")
              }
              disabled={!!loading}
              className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {loading === "accountant" ? "Entrando..." : "Demo Contador"}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() =>
                handleLogin("employee-demo@contractadvisor.com", "employee")
              }
              disabled={!!loading}
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {loading === "employee" ? "Entrando..." : "Demo Empleado"}
            </button>
          </div>

          <p className="text-xs text-slate-400 italic">
            * Acceso instantáneo sin registro. Prueba las funciones ahora.
          </p>

          {/* Mini Features */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div className="flex flex-col gap-2">
              <FaFileSignature className="text-blue-500 text-xl" />
              <span className="text-sm font-bold text-slate-700">
                Legally Secure
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <FaChartLine className="text-blue-500 text-xl" />
              <span className="text-sm font-bold text-slate-700">
                Real-time Tracking
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <FaShieldAlt className="text-blue-500 text-xl" />
              <span className="text-sm font-bold text-slate-700">
                Cloud Storage
              </span>
            </div>
          </div>
        </div>

        {/* Lado Derecho */}
        <div className="hidden lg:flex justify-center relative">
          <div className="absolute inset-0 bg-blue-400/10 blur-3xl rounded-full"></div>
          <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-[400px] h-[500px] bg-slate-50 rounded-[24px] overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <FaShieldAlt className="text-[120px] text-blue-600 mb-6 opacity-20" />
              <div className="space-y-3 w-full">
                <div className="h-4 bg-slate-200 rounded-full w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded-full w-1/2 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded-full w-5/6 mx-auto pt-8"></div>
              </div>
              <p className="mt-12 text-slate-400 font-medium italic">
                "The future of agro-contracts is here."
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Hero;
