import InscripcionForm from "@/components/inscripcion/inscripcion-form";
import { CICLO } from "@/components/inscripcion/config";

export const metadata = {
  title: `Inscripción ${CICLO} | Escuela de Ministerio Sobrenatural`,
  description: `Formulario de inscripción a la Escuela de Ministerio Sobrenatural, ciclo ${CICLO}.`,
};

export default function InscripcionPage() {
  return (
    <section className="relative bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 md:pt-40 xl:pt-[220px] pb-16 font-articulat">
        <h1 className="text-3xl md:text-5xl font-bold text-ems-blue">Inscripción {CICLO}</h1>
        <p className="mt-4 mb-8 text-ems-muted md:text-lg leading-relaxed">
          Escuela de Ministerio Sobrenatural. Antes de empezar, tené a mano la carta pastoral
          firmada por tu pastor. Tus respuestas se guardan en este dispositivo mientras completás
          el formulario.
        </p>
        <InscripcionForm />
      </div>
    </section>
  );
}
