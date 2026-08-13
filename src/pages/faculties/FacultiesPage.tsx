import { useEffect, useState } from "react";
import { getFaculties } from "../../services/dataService";

function FacultiesPage() {
  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    getFaculties().then(setFaculties);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Facultades</h1>
        <p className="text-gray-500">Resumen de facultades y programas asociados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {faculties.map((faculty) => (
          <div key={faculty.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#00482B]">{faculty.name}</h2>
            <p className="mt-3 text-sm text-gray-600">Estudiantes: {faculty.headcount}</p>
            <p className="text-sm text-gray-600">Programas activos: {faculty.programs}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultiesPage;
