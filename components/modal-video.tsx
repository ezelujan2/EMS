"use client";

import { useEffect, useState } from "react";

const FOTOS = [
  "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988701/_DSC0891_qzcl2f.jpg",
  "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708989208/DSC_3841_eyfcmj.jpg",
  "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988699/_DSC4846_uujffe.jpg",
  "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988776/DSC_4095_ibovtl.jpg",
  "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737732011/_DSC7787_faolth.jpg",
];

// Galería de fotos que cambia sola, con la frase de la EMS encima.
export default function ModalVideo() {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActual((i) => (i + 1) % FOTOS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-4 sm:px-6">
      <div className="relative mx-auto max-w-[1500px] aspect-[4/5] sm:aspect-[16/9] xl:aspect-[21/9] overflow-hidden rounded-[10px] bg-ems-blue">
        {FOTOS.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === actual ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 xl:p-16 text-white">
          <h2 className="font-articulat font-bold text-3xl sm:text-5xl xl:text-7xl leading-tight max-w-4xl">
            El Reino de Dios se ha acercado
          </h2>
          <p className="mt-4 font-articulat font-medium text-base sm:text-xl xl:text-2xl text-white/90 max-w-2xl leading-relaxed">
            Experimentá la manifestación de la vida de Cristo y encontrá la plenitud como hijo, en
            una relación correcta con el Padre.
          </p>
          <div className="mt-6 flex gap-2" aria-hidden>
            {FOTOS.map((src, i) => (
              <span
                key={src}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === actual ? "w-8 bg-ems-sun" : "w-4 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
