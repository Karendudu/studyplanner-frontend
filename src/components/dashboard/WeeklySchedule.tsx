import { useEffect, useState } from "react";
import { getHorarios } from "../../services/backend";
import type { Horario } from "../../services/types";

function WeeklySchedule() {
    const [items, setItems] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const data = await getHorarios();
                if (!cancelled) {
                    setItems(data);
                }
            } catch {
                if (!cancelled) setItems([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="surface-card p-6">
            <h2 className="text-xl font-bold text-primary mb-6">Horarios disponibles</h2>

            {loading ? (
                <p className="text-sm text-[#52665a]">Cargando horario...</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-[#52665a]">Todavía no hay horarios disponibles.</p>
            ) : (
                <div className="space-y-3">
                    {items.map((schedule, index) => (
                        <div
                            key={schedule.idHorario ?? index}
                            className="flex justify-between items-center border border-surface rounded-xl p-4 hover:bg-brand-soft duration-300 dark:border-cundi-700"
                        >
                            <strong>Horario #{schedule.idHorario ?? "—"}</strong>
                            <span className="text-gray-500">
                                {schedule.totalCreditos ?? "—"} créditos · {schedule.totalHorasSemanales ?? "—"} horas/semana
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WeeklySchedule;