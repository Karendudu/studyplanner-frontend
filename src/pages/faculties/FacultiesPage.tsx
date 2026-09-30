import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { engineeringLearningPaths, engineeringProgram } from "../../constants/engineeringProgram";

function FacultiesPage() {
  const [selectedPath, setSelectedPath] = useState(0);
  const learningPath = engineeringLearningPaths[selectedPath];

  return (
    <div className="mx-auto max-w-6xl space-y-8 text-[#152e21]">
      <header className="space-y-2 border-b border-[#d1dacf] pb-5">
        <p className="text-sm font-semibold uppercase text-[#427150]">{engineeringProgram.faculty}</p>
        <h1 className="text-3xl font-bold text-[#0f2a1d]">{engineeringProgram.name}</h1>
      </header>

      <img
        src={engineeringProgram.banner}
        alt="Programa de Ingeniería de Sistemas y Computación de la Universidad de Cundinamarca"
        className="max-h-60 w-full object-cover object-center"
        loading="lazy"
      />

      <section className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="text-xl font-semibold text-[#0f2a1d]">Información del programa</h2>
          <p className="mt-3 leading-relaxed text-[#42594b]">
            Formación en Sistemas de Información e Ingeniería de Computación, orientada a desarrollar
            soluciones tecnológicas para las necesidades del entorno.
          </p>
          <a
            href={engineeringProgram.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-[#087344] underline underline-offset-4"
          >
            Información oficial de UdeC <ExternalLink size={16} />
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-l-2 border-[#79c000] pl-5">
          <div><dt className="text-sm text-[#5b6d60]">Nivel</dt><dd className="font-semibold">{engineeringProgram.level}</dd></div>
          <div><dt className="text-sm text-[#5b6d60]">Duración</dt><dd className="font-semibold">{engineeringProgram.semesters} semestres</dd></div>
          <div><dt className="text-sm text-[#5b6d60]">Créditos</dt><dd className="font-semibold">{engineeringProgram.credits}</dd></div>
        </dl>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#0f2a1d]">Ruta de aprendizaje</h2>
            <p className="mt-1 text-sm text-[#5b6d60]">Documento oficial por sede del programa.</p>
          </div>
          <div className="inline-flex border border-[#cbd9ce] bg-white p-1" role="tablist" aria-label="Ruta por sede">
            {engineeringLearningPaths.map((path, index) => (
              <button
                key={path.label}
                type="button"
                role="tab"
                aria-selected={selectedPath === index}
                onClick={() => setSelectedPath(index)}
                className={`px-3 py-2 text-sm font-semibold ${selectedPath === index ? "bg-[#0f6840] text-white" : "text-[#315641] hover:bg-[#edf5ef]"}`}
              >
                {path.label}
              </button>
            ))}
          </div>
        </div>
        <iframe
          key={learningPath.url}
          src={`${learningPath.url}#view=FitH`}
          title={`Ruta de aprendizaje de Ingeniería de Sistemas y Computación: ${learningPath.label}`}
          className="h-[72vh] min-h-[520px] w-full border border-[#d1dacf] bg-white"
        />
        <a
          href={learningPath.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#087344] underline underline-offset-4"
        >
          Abrir o descargar la ruta de {learningPath.label} <ExternalLink size={15} />
        </a>
      </section>
    </div>
  );
}

export default FacultiesPage;
