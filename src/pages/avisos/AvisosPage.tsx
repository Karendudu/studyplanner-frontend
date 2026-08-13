import { useEffect, useState } from "react";
import { getNotices } from "../../services/dataService";

function AvisosPage() {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Avisos</h1>
        <p className="text-gray-500">Revisa los comunicados recientes y la disponibilidad de materias.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {notices.map((notice, index) => (
          <div key={`${notice.title}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#00482B]">{notice.title}</h2>
            <p className="mt-3 text-gray-600">{notice.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvisosPage;
