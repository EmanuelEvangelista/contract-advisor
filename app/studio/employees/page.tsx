"use client";
import { useState, useEffect } from "react";
import EmployeeStatusCard from "@/components/EmployeeStatusCard";

const ManageEmployeesPage = ({ params }: { params: { studioId: string } }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`/api/studio/${params.studioId}/members`);
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error al cargar empleados");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [params.studioId]);

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

      <div className="grid gap-4">
        {employees.map((emp: any) => (
          <EmployeeStatusCard key={emp._id} employee={emp} />
        ))}
      </div>
    </div>
  );
};

export default ManageEmployeesPage;
