import { useEffect, useState } from "react";
import { getSchedules } from "../../services/dataService";

function HorariosPage() {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    getSchedules().then(setSchedules);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Horarios</h1>
        <p className="text-gray-500">Ve la disponibilidad de grupos y crea tu esquema de horario.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {schedules.map((item, index) => (
          <div key={`${item.day}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#00482B]">{item.subject}</h2>
              <span className="text-sm text-gray-500">{item.day}</span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-gray-700">
              <p><strong>Hora:</strong> {item.time}</p>
              <p><strong>Grupo:</strong> {item.group}</p>
              <p><strong>Aula:</strong> {item.location}</p>
              <p><strong>Cupos disponibles:</strong> {item.availability}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorariosPage;
