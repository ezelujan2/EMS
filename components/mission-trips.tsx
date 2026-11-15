"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import TituloSeccion from "./ui/titulo-seccion";

// Fotos del ministerio en los viajes (de 1 a 5). La primera se muestra más grande.
// Para agregar una: guardarla en /public/ems27/viajes/ y sumarla acá con su epígrafe.
const FOTOS: { src: string; pie: string; encuadre?: string }[] = [
  { src: "/ems27/viaje-bariloche-2026.jpg", pie: "Salida a Bariloche · 2026", encuadre: "50% 37%" },
];

const VIAJES = [
  { anio: "2024", lugar: "Pergamino", provincia: "Buenos Aires" },
  { anio: "2025", lugar: "San Luis", provincia: "San Luis" },
  { anio: "2026", lugar: "Bariloche", provincia: "Río Negro" },
];

const aparecer = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function MissionTrips() {
  return (
    <section id="misiones" className="px-4 sm:px-6 pt-24 md:pt-36 scroll-mt-24">
      <Image src="/ems27/globo.png" alt="" width={290} height={229} className="mx-auto mb-8 h-auto w-20 md:w-24" />
      <TituloSeccion titulo="Viajes misioneros">
        Cada año salimos como escuela a llevar el amor del Padre a otra ciudad del país. Es el
        momento de poner en práctica lo aprendido: servir, orar por las personas y ver el Reino
        manifestarse fuera de las paredes de la iglesia.
      </TituloSeccion>

      <Mosaico />

      {/* Línea de tiempo */}
      <ol className="relative mx-auto mt-12 md:mt-16 grid max-w-[1300px] gap-8 font-articulat md:grid-cols-4 md:gap-6">
        <span
          className="absolute left-[11px] top-3 bottom-3 w-[3px] bg-ems-blue/20 md:left-3 md:right-3 md:top-[11px] md:bottom-auto md:h-[3px] md:w-auto"
          aria-hidden
        />
        {VIAJES.map((v, i) => (
          <motion.li
            key={v.anio}
            {...aparecer}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            className="relative pl-10 md:pl-0 md:pt-10"
          >
            <span className="absolute left-0 top-0 h-6 w-6 rounded-full border-[3px] border-white bg-ems-blue ring-[3px] ring-ems-blue/30" />
            <div className="font-bold text-ems-blue text-4xl md:text-5xl">{v.anio}</div>
            <div className="mt-1 font-bold text-gray-900 text-xl">{v.lugar}</div>
            <div className="text-ems-muted">{v.provincia}</div>
          </motion.li>
        ))}
        <motion.li
          {...aparecer}
          transition={{ duration: 0.5, delay: VIAJES.length * 0.12, ease: "easeOut" }}
          className="relative pl-10 md:pl-0 md:pt-10"
        >
          <span className="absolute left-0 top-0 h-6 w-6 rounded-full border-[3px] border-dashed border-ems-sun bg-white" />
          <div className="font-bold text-ems-sun text-4xl md:text-5xl">2027</div>
          <div className="mt-1 font-bold text-gray-900 text-xl">Próximo destino</div>
          <Link href="/inscripcion" className="text-ems-blue underline underline-offset-4 hover:no-underline">
            Sumate a la EMS
          </Link>
        </motion.li>
      </ol>
    </section>
  );
}

// Mosaico que se acomoda según la cantidad de fotos.
// Computadora: la primera ocupa la mitad izquierda; el resto se reparte a la derecha.
// Celular: la primera arriba a todo el ancho; el resto en dos columnas.
function Mosaico() {
  const n = FOTOS.length;
  const resto = n - 1;
  // Clases de cada foto del lado derecho (computadora) según cuántas hay.
  const derecha = (i: number) => {
    if (resto === 1) return "md:col-span-2 md:row-span-2";
    if (resto === 2) return "md:col-span-2";
    if (resto === 3) return i === 0 ? "md:col-span-2" : "";
    return "";
  };

  return (
    <div
      className={`mx-auto mt-14 md:mt-20 grid max-w-[1300px] grid-cols-2 gap-2 md:gap-3 ${
        n > 1 ? "md:grid-cols-4 md:grid-rows-2 md:h-[min(620px,48vw)]" : ""
      }`}
    >
      {FOTOS.map((f, i) => {
        const principal = i === 0;
        const ultimaSuelta = !principal && resto % 2 === 1 && i === n - 1;
        return (
          <motion.figure
            key={f.src}
            {...aparecer}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
            className={`group relative overflow-hidden rounded-[10px] bg-ems-blue/10 ${
              principal
                ? `col-span-2 aspect-[4/3] ${n > 1 ? "md:aspect-auto md:row-span-2" : "sm:aspect-[2/1]"}`
                : `aspect-square md:aspect-auto ${ultimaSuelta ? "col-span-2 aspect-[2/1]" : ""} ${derecha(i - 1)}`
            }`}
          >
            <Image
              src={f.src}
              alt={f.pie}
              fill
              sizes={principal ? "(min-width: 768px) 650px, 100vw" : "(min-width: 768px) 325px, 50vw"}
              style={{ objectPosition: f.encuadre ?? "50% 50%" }}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 md:px-4 md:pb-3 font-articulat font-medium text-white text-xs md:text-base">
              {f.pie}
            </figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}
