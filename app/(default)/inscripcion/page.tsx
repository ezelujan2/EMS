import InscripcionForm from "@/components/inscripcion/inscripcion-form";
import EstadoInscripciones from "@/components/inscripcion/estado-inscripciones";
import { CICLO, DOCUMENTOS } from "@/components/inscripcion/config";

export const metadata = {
  title: `Inscripción ${CICLO}`,
  description: `Formulario de inscripción a la Escuela de Ministerio Sobrenatural, ciclo ${CICLO}.`,
};

export default function InscripcionPage() {
  return (
    <section className="relative bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 md:pt-40 xl:pt-[220px] pb-16 font-articulat">
        <h1 className="text-3xl md:text-5xl font-bold text-ems-blue">Inscripción {CICLO}</h1>
        {/* Abiertas o cerradas se maneja desde la pestaña "Configuración" de la planilla. */}
        <EstadoInscripciones>
          <p className="mt-4 text-ems-muted md:text-lg leading-relaxed">
            Escuela de Ministerio Sobrenatural. Completarlo lleva unos 10 minutos y tus respuestas
            se guardan en este dispositivo mientras lo completás.
          </p>
          {/* La carta se puede bajar antes de empezar, para que el pastor la vaya firmando. */}
          <div className="mt-6 mb-8 flex flex-col gap-4 rounded-[10px] border-2 border-ems-sun bg-ems-sun/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-gray-900">Antes de empezar: la carta pastoral</p>
              <p className="mt-1 text-sm text-gray-700">
                Descargala y pedile a tu pastor que la firme. Si todavía no la tenés, podés
                inscribirte igual y subirla más tarde.
              </p>
            </div>
            <a
              href={DOCUMENTOS.cartaPastoral}
              download="Carta pastoral EMS 2027.pdf"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-[10px] bg-ems-blueStrong px-5 font-semibold text-white transition-colors duration-300 hover:bg-[#3A5BCC]"
            >
              Descargar carta pastoral
            </a>
          </div>
          <InscripcionForm />
        </EstadoInscripciones>
      </div>
    </section>
  );
}
