import { useEffect, useState } from "react";
import { getAudits } from "../../services/dataService";

function AuditoriaPage() {
  const [audits, setAudits] = useState<any[]>([]);

  useEffect(() => {
    getAudits().then(setAudits);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Auditoría</h1>
        <p className="text-gray-500">Historial de acciones en el sistema para detectar cambios críticos.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] divide-y divide-gray-200">
          <thead className="bg-[#F7F9F8] text-left text-sm uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Acción</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm text-gray-700">{audit.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{audit.action}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{audit.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{audit.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditoriaPage;
