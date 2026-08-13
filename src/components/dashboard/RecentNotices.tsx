const notices = [

    {

        title: "Inscripción de materias",

        date: "10 Julio"

    },

    {

        title: "Cambio de horario",

        date: "12 Julio"

    },

    {

        title: "Actualización del sistema",

        date: "15 Julio"

    }

]

function RecentNotices() {

    return (

        <div className="surface-card p-6">

            <h2 className="text-xl font-bold text-primary mb-6">

                Avisos recientes

            </h2>

            <div className="space-y-5">

                {

                    notices.map(notice => (

                        <div
                            key={notice.title}
                            className="border-l-4 border-cundi-600 pl-4"
                        >

                            <h3 className="font-semibold">

                                {notice.title}

                            </h3>

                            <p className="text-gray-500">

                                {notice.date}

                            </p>

                        </div>

                    ))

                }

            </div>

        </div>

    )

}

export default RecentNotices;