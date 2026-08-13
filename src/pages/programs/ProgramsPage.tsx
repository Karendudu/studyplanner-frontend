import { useEffect, useState } from "react";
import { getPrograms } from "../../services/dataService";

function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    getPrograms().then(setPrograms);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Programas y materias</h1>
        <p className="text-gray-500">Vista previa de las opciones disponibles para inscribir.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <div key={program.code} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#00482B]">{program.name}</h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-[#007B3E]">{program.code}</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">Créditos: {program.credits}</p>
            <p className="text-sm text-gray-600">Semestre: {program.semester}</p>
            <p className="text-sm text-gray-600">Cupos disponibles: {program.availability}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgramsPage;
