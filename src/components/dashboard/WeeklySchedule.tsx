const schedule = [

    "Lunes",

    "Martes",

    "Miércoles",

    "Jueves",

    "Viernes"

]

function WeeklySchedule() {

    return (

        <div className="surface-card p-6">

            <h2 className="text-xl font-bold text-primary mb-6">

                Horario semanal

            </h2>

            <div className="space-y-3">

                {

                    schedule.map(day => (

                        <div
                            key={day}
                            className="flex justify-between items-center border border-surface rounded-xl p-4 hover:bg-brand-soft duration-300 dark:border-cundi-700"
                        >

                            <strong>

                                {day}

                            </strong>

                            <span className="text-gray-500">

                                Sin materias

                            </span>

                        </div>

                    ))

                }

            </div>

        </div>

    )

}

export default WeeklySchedule;