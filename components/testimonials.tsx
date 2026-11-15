"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TituloSeccion from "./ui/titulo-seccion";

const TESTIMONIOS = [
  {
    nombre: "Sofi Denari",
    detalle: "Alumna 1er año 2023",
    foto: "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737652921/Screenshot_2025-01-23_at_2.20.46_PM_hqvypc.png",
    texto:
      "A mí me pasó que en la EMS siento que llegué a conocer muchísimo más a Jesús. Y entendí que eso implica tener una relación con Él. Lo cual es hermoso y está disponible para todos, y todo el tiempo. Descubrí un amor que nunca imaginé. Una relación tan hermosa que transformó mi vida por completo. Entendí por fin a qué se refieren cuando dicen “nacer de nuevo”: siento que antes vivía, pero no estaba realmente “viva”, y ahora sí. Tuve la posibilidad de tener mucho más tiempo de intimidad con Él. Pasar tiempo juntos es lo que fue haciendo un trabajo profundo en mí. Estar en su presencia es lo que más me empezó a alimentar, a sanar y a llenar. Entendí que nada se compara. Hacía tiempo había recibido una palabra que decía que yo iba a ser como un árbol plantado a la orilla del río: no temerá cuando venga el calor y sus hojas estarán verdes, no se angustiará en año de sequía y siempre dará frutos. Y así siento que fue: un año de echar raíces profundas con Él y afirmarme en su amor.",
  },
  {
    nombre: "Damaris Meana",
    detalle: "Alumna 1er año 2023",
    foto: "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737653058/Screenshot_2025-01-23_at_2.24.11_PM_nhatpa.png",
    texto:
      "Debido a la exigencia de mi trabajo, al mal uso y otros factores, empecé a tener problemas en mis cuerdas vocales. Me encontraron un hiatus y, a su vez, en una de las cuerdas tenía un puntito rojo, producto de que se me había explotado un vaso sanguíneo. En un tiempo de adoración en la escuela empiezo a sentir un calor en la zona afectada y siento que el Espíritu Santo me estaba sanando. A las semanas voy al médico por control, ¡y descubro que estaba sana! Dios no solo sana cuando lo buscamos, sino que tiene mil formas creativas de hacerlo: solo basta creer, y de lo demás Él se ocupa.",
  },
];

const INTERVALO = 9000;

export default function Testimonials() {
  const [actual, setActual] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const [abierto, setAbierto] = useState(false);
  const [pausado, setPausado] = useState(false);
  const sinMovimiento = useReducedMotion();
  const t = TESTIMONIOS[actual];
  const rotando = !abierto && !pausado && !sinMovimiento && TESTIMONIOS.length > 1;

  function ir(n: number) {
    setDireccion(n > actual || (actual === TESTIMONIOS.length - 1 && n === 0) ? 1 : -1);
    setActual((n + TESTIMONIOS.length) % TESTIMONIOS.length);
    setAbierto(false);
  }

  useEffect(() => {
    if (!rotando) return;
    const id = setTimeout(() => ir(actual + 1), INTERVALO);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual, rotando]);

  return (
    <section className="px-4 sm:px-6 pt-24 md:pt-36">
      <TituloSeccion titulo="Testimonios" id="testimonios">
        Cuando Dios se manifiesta, no solo demuestra su poder y amor, sino también su carácter que
        nunca cambia (Ap. 19:10). Que cada una de estas palabras sea una invitación a que
        experimentes más de Él.
      </TituloSeccion>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        onFocusCapture={() => setPausado(true)}
        onBlurCapture={() => setPausado(false)}
        className="mx-auto mt-14 md:mt-20 max-w-[1100px] overflow-hidden rounded-[10px] border-[3px] border-ems-blue bg-white font-articulat"
        aria-roledescription="carrusel"
        aria-label="Testimonios de alumnos"
      >
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Persona */}
          <div className="relative flex flex-col items-center justify-center gap-5 bg-ems-blue px-6 py-10 text-center md:py-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={t.nombre}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <Image
                  src={t.foto}
                  alt={t.nombre}
                  width={160}
                  height={160}
                  className="h-28 w-28 md:h-36 md:w-36 rounded-full object-cover ring-4 ring-white/80"
                />
                <div className="mt-5 font-bold text-white text-2xl">{t.nombre}</div>
                <div className="text-ems-offwhite/90">{t.detalle}</div>
              </motion.div>
            </AnimatePresence>

            {TESTIMONIOS.length > 1 && (
              <div className="flex items-center gap-3">
                <Flecha dir="izq" onClick={() => ir(actual - 1)} />
                <div className="flex gap-2">
                  {TESTIMONIOS.map((x, i) => (
                    <button
                      key={x.nombre}
                      type="button"
                      onClick={() => ir(i)}
                      aria-label={`Ver testimonio de ${x.nombre}`}
                      aria-current={i === actual}
                      className={`relative h-2 overflow-hidden rounded-full bg-white/40 transition-all duration-300 ${
                        i === actual ? "w-10" : "w-2 hover:bg-white/70"
                      }`}
                    >
                      {i === actual && (
                        <motion.span
                          key={`${actual}-${rotando}`}
                          className="absolute inset-y-0 left-0 bg-ems-sun"
                          initial={{ width: rotando ? "0%" : "100%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: rotando ? INTERVALO / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <Flecha dir="der" onClick={() => ir(actual + 1)} />
              </div>
            )}
          </div>

          {/* Testimonio */}
          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <svg
              className="absolute right-6 top-6 h-16 w-16 text-ems-sun/25 md:h-24 md:w-24"
              viewBox="0 0 64 64"
              fill="currentColor"
              aria-hidden
            >
              <path d="M37.89 58.338c-2.648-5.63-3.572-10.045-2.774-13.249.8-3.203 8.711-13.383 23.737-30.538l2.135.532c-6.552 10.033-10.532 17.87-11.939 23.515-.583 2.34.22 6.158 2.41 11.457l-13.57 8.283zm-26.963-6.56c-2.648-5.63-3.572-10.046-2.773-13.25.799-3.203 8.71-13.382 23.736-30.538l2.136.533c-6.552 10.032-10.532 17.87-11.94 23.515-.583 2.339.22 6.158 2.41 11.456l-13.57 8.283z" />
            </svg>
            <AnimatePresence mode="wait" initial={false} custom={direccion}>
              <motion.div
                key={t.nombre}
                custom={direccion}
                variants={{
                  entra: (d: number) => ({ opacity: 0, x: d * 40 }),
                  centro: { opacity: 1, x: 0 },
                  sale: (d: number) => ({ opacity: 0, x: d * -40 }),
                }}
                initial="entra"
                animate="centro"
                exit="sale"
                transition={{ duration: 0.35, ease: "easeOut" }}
                drag={TESTIMONIOS.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) ir(actual + 1);
                  else if (info.offset.x > 60) ir(actual - 1);
                }}
                className="relative touch-pan-y"
              >
                <motion.blockquote
                  layout
                  className={`font-medium text-gray-700 text-lg md:text-xl leading-relaxed ${
                    abierto ? "" : "line-clamp-[8]"
                  }`}
                >
                  “{t.texto}”
                </motion.blockquote>
                <button
                  type="button"
                  onClick={() => setAbierto(!abierto)}
                  aria-expanded={abierto}
                  className="mt-5 inline-flex items-center gap-2 font-medium text-ems-blue hover:underline underline-offset-4"
                >
                  {abierto ? "Ver menos" : "Leer completo"}
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${abierto ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Flecha({ dir, onClick }: { dir: "izq" | "der"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "izq" ? "Testimonio anterior" : "Testimonio siguiente"}
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 text-white transition-colors duration-300 hover:bg-white hover:text-ems-blue"
    >
      <svg className={`h-4 w-4 ${dir === "izq" ? "rotate-180" : ""}`} viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M1 7h21M16 1l6 6-6 6" />
      </svg>
    </button>
  );
}
