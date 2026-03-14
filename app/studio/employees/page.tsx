"use client";
import { useState, useEffect } from "react";
import EmployeeStatusCard from "@/components/EmployeeStatusCard";
import { useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

const ManageEmployeesPage = () => {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const studioId = session?.user?.studioId;

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!studioId) return;
      try {
        const res = await fetch(`/api/studio/${studioId}/members`);
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error al cargar empleados");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [session]);

  if (!session || session.user.role === "employee") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          Gestión de Personal
        </h1>
        <p className="text-slate-500 text-sm italic">
          Solo los contadores pueden activar o inactivar perfiles para
          auditoría.
        </p>
      </header>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner loading={loading} />
        </div>
      ) : (
        <div className="grid gap-4">
          {employees
            .filter((emp: any) => emp.role === "employee") // Filtra solo los que tienen el rol de empleado
            .map((emp: any) => (
              <EmployeeStatusCard key={emp._id} employee={emp} />
            ))}
        </div>
      )}
    </div>
  );
};

export default ManageEmployeesPage;
