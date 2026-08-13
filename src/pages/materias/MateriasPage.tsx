import { useEffect, useState } from "react";
import { getSubjects } from "../../services/dataService";

function MateriasPage() {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    getSubjects().then(setSubjects);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Materias</h1>
        <p className="text-gray-500">Consulta cupos, semestres y disponibilidad para planificar tu horario.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {subjects.map((subject) => (
          <div key={subject.code} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#00482B]">{subject.name}</h2>
                <p className="text-sm text-gray-500">{subject.code} · {subject.program}</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-[#007B3E]">{subject.semester}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-gray-700">
                Créditos: <strong>{subject.credits}</strong>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-gray-700">
                Cupos: <strong>{subject.availability}</strong> / {subject.capacity}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Instructor: {subject.instructor}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MateriasPage;
