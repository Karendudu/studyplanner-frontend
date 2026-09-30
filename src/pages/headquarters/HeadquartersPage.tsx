import { ExternalLink } from "lucide-react";
import { engineeringLocations, engineeringProgram } from "../../constants/engineeringProgram";

function HeadquartersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 text-[#152e21]">
      <header className="border-b border-[#d1dacf] pb-5">
        <p className="text-sm font-semibold uppercase text-[#427150]">{engineeringProgram.name}</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0f2a1d]">Sedes del programa</h1>
        <p className="mt-2 text-sm text-[#5b6d60]">Lugares de desarrollo publicados por la Universidad de Cundinamarca.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {engineeringLocations.map((location) => (
          <article key={location.snies} className="border border-[#d5dfd7] bg-white p-5">
            <p className="text-sm font-semibold uppercase text-[#427150]">SNIES {location.snies}</p>
            <h2 className="mt-1 text-xl font-semibold text-[#0f2a1d]">{location.name}</h2>
            <p className="mt-3 text-sm text-[#42594b]">Contacto del programa</p>
            <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`} className="font-medium text-[#087344]">
              {location.phone}
            </a>
          </article>
        ))}
      </div>

      <a href={engineeringProgram.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-[#087344] underline underline-offset-4">
        Consultar información oficial de sedes <ExternalLink size={16} />
      </a>
    </div>
  );
}

export default HeadquartersPage;
