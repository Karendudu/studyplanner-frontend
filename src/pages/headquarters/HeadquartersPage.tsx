import { useEffect, useState } from "react";
import { getHeadquarters } from "../../services/dataService";

function HeadquartersPage() {
  const [headquarters, setHeadquarters] = useState<any[]>([]);

  useEffect(() => {
    getHeadquarters().then(setHeadquarters);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Sedes</h1>
        <p className="text-gray-500">Estado operativo de las sedes del sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {headquarters.map((headquarter) => (
          <div key={headquarter.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#00482B]">{headquarter.name}</h2>
            <p className="mt-3 text-sm text-gray-600">Capacidad: {headquarter.capacity}</p>
            <p className="text-sm text-gray-600">Estado: {headquarter.active ? "Activa" : "Inactiva"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeadquartersPage;
