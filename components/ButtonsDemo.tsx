"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function ButtonsDemo() {
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
    <div className="flex flex-col items-center gap-4 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Select a Demo Profile
      </h2>

      {/* Botón para Pedro (Contador) */}
      <button
        onClick={() =>
          handleLogin("demo-reclutador@contractadvisor.com", "admin")
        }
        disabled={!!loading}
        className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-xl shadow-md transition-all active:scale-95 flex justify-center items-center"
      >
        {loading === "admin" ? "Connecting..." : "Login as Accountant (Admin)"}
      </button>

      {/* Botón para Juan (Empleado) */}
      <button
        onClick={() =>
          handleLogin("employee-demo@contractadvisor.com", "employee")
        }
        disabled={!!loading}
        className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 rounded-xl shadow-md transition-all active:scale-95 flex justify-center items-center"
      >
        {loading === "employee" ? "Connecting..." : "Login as Employee"}
      </button>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Try both accounts to see how data and permissions <br /> change based on
        the user role.
      </p>
    </div>
  );
}
