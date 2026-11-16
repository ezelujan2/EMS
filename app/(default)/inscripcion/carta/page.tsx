import { Suspense } from "react";
import SubirCarta from "@/components/inscripcion/subir-carta";

export const metadata = {
  title: "Subir carta pastoral",
  robots: { index: false },
};

export default function CartaPage() {
  return (
    <section className="relative bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 md:pt-40 xl:pt-[220px] pb-16 font-articulat">
        <h1 className="text-3xl md:text-5xl font-bold text-ems-blue">Carta pastoral</h1>
        <Suspense>
          <SubirCarta />
        </Suspense>
      </div>
    </section>
  );
}
