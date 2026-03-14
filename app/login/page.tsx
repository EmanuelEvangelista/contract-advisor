"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaExclamationTriangle,
  FaGoogle,
  FaUserTie,
  FaUserEdit,
} from "react-icons/fa";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error === "CredentialsSignin" || error === "Invalid password"
          ? "Contraseña o usuario incorrecto"
          : error;

      toast.error(errorMessage, { toastId: "auth-error" });

      // Opcional: Limpiar la URL para que no vuelva a salir al refrescar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [error]);

  const handleDemoLogin = async (email: string, role: string) => {
    setLoading(role);
    await signIn("credentials", {
      email: email,
      password: "password123",
      callbackUrl: "/panel",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 text-center">
        {/* Icono dinámico: Si hay error muestra alerta, si no, un candado o logo */}
        <div className="mb-6 flex justify-center">
          <div
            className={`${error ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"} p-4 rounded-full`}
          >
            <FaExclamationTriangle size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          {error ? "Acceso Restringido" : "Welcome Back"}
        </h1>

        <p className="text-slate-500 mb-8">
          {error === "Your account has been deactivated."
            ? "Tu cuenta ha sido desactivada por el administrador."
            : "Selecciona un perfil para probar la plataforma."}
        </p>

        {/* --- BOTONES DE DEMO (NUEVOS) --- */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() =>
              handleDemoLogin(
                "demo-reclutador@contractadvisor.com",
                "accountant",
              )
            }
            disabled={!!loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <FaUserTie />{" "}
            {loading === "accountant"
              ? "Iniciando..."
              : "Entrar como Contador (Demo)"}
          </button>

          <button
            onClick={() =>
              handleDemoLogin("employee-demo@contractadvisor.com", "employee")
            }
            disabled={!!loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            <FaUserEdit />{" "}
            {loading === "employee"
              ? "Iniciando..."
              : "Entrar como Empleado (Demo)"}
          </button>
        </div>

        <div className="relative mb-6">
          <hr className="border-slate-100" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-slate-400 font-bold uppercase">
            o
          </span>
        </div>

        <a
          href="/"
          className="block mt-6 text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
