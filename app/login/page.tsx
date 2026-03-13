"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FaExclamationTriangle, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      // El error viene de NextAuth como 'Your account has been deactivated.'
      toast.error(error, { toastId: "auth-error" });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-rose-100 p-4 rounded-full text-rose-600">
            <FaExclamationTriangle size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Acceso Restringido
        </h1>

        <p className="text-slate-500 mb-8">
          {error === "Your account has been deactivated."
            ? "Tu cuenta ha sido desactivada por el administrador del estudio."
            : "Por favor, inicia sesión para continuar."}
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/panel" })}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
        >
          <FaGoogle /> Intentar con otra cuenta
        </button>

        <a
          href="/"
          className="block mt-6 text-sm font-semibold text-indigo-600 hover:underline"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
