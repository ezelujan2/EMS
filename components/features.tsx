"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TituloSeccion from "./ui/titulo-seccion";

const VALORES = [
  {
    titulo: "Presencia",
    icono: "/ems27/icono-nube.png",
    foto: "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737731807/DSC03646_lft1id.jpg",
    video: "/videos/Eze.mp4",
    texto:
      "Honramos la presencia de Dios y buscamos cultivar ambientes donde Él sea el centro. En ese lugar lo conocemos y descubrimos más de su bondad, de su belleza, de quién es Él. Mientras más lo conocemos, más experimentamos su verdad y su cercanía.",
  },
  {
    titulo: "Poder",
    icono: "/ems27/icono-fuego.png",
    foto: "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737731807/DSC03837_i3grjt.jpg",
    video: "/videos/Dani.mp4",
    texto:
      "Llamados a una vida de impacto y propósito al servicio del Reino de Dios, porque el evangelio son buenas nuevas, y esas buenas nuevas no vienen separadas de su poder. Fuimos creados para vivir una vida sobrenatural.",
  },
  {
    titulo: "Comunidad",
    icono: "/ems27/icono-carita.png",
    foto: "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737719606/DSC03854_ynl6ml.jpg",
    video: "/videos/Flor.mp4",
    texto:
      "Fuimos creados para vivir en su cuerpo, la iglesia. Esa familia y comunidad, donde somos conocidos y podemos conocer más a Jesús, donde Él se encarna en la manifestación de su cuerpo y podemos ver la simpleza de la gracia y el poder de la vulnerabilidad.",
  },
  {
    titulo: "Transformación",
    icono: "/ems27/icono-paloma.png",
    foto: "https://res.cloudinary.com/dmoqzhgjk/image/upload/t_Valores EMS/v1705459547/poder_nro5cd.jpg",
    video: "/videos/Patri.mp4",
    texto:
      "Mientras más conocemos a Dios, más conocemos quiénes somos como hijos. En su presencia somos transformados a la imagen de Jesús, el Hijo, que nos mostró lo que de verdad era vivir en una plena comunión con el Padre. Él siempre nos lleva al diseño original.",
  },
];

export default function Features() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<{ src: string; titulo: string } | null>(null);

  function abrirVideo(src: string, titulo: string) {
    setVideo({ src, titulo });
    dialogRef.current?.showModal();
  }

  function cerrarVideo() {
    videoRef.current?.pause();
    dialogRef.current?.close();
  }

  return (
    <section id="values" className="px-4 sm:px-6 pt-20 md:pt-32 scroll-mt-24">
      <TituloSeccion titulo="¿Qué es la EMS?">
        La identidad de la EMS. Cada valor es un pilar de compromiso. Estos principios son más que
        palabras: son el núcleo de nuestra misión como escuela.
      </TituloSeccion>

      <div className="mx-auto mt-14 md:mt-24 max-w-[1300px] space-y-16 md:space-y-28">
        {VALORES.map((v, i) => (
          <motion.article
            key={v.titulo}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid items-center gap-8 md:gap-16 md:grid-cols-[3fr_2fr]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.foto}
              alt={v.titulo}
              loading="lazy"
              className={`w-full aspect-[3/2] object-cover rounded-[10px] ${i % 2 ? "md:order-2" : ""}`}
            />
            <div className="font-articulat">
              <Image src={v.icono} alt="" width={64} height={64} className="h-12 w-auto md:h-14" />
              <h3 className="mt-5 font-bold text-ems-blue text-4xl md:text-5xl">{v.titulo}</h3>
              <p className="mt-4 font-medium text-ems-muted text-lg md:text-xl leading-relaxed">
                {v.texto}
              </p>
              <button
                type="button"
                onClick={() => abrirVideo(v.video, v.titulo)}
                className="mt-7 inline-flex items-center gap-3 rounded-[10px] border-[3px] border-ems-blue px-6 h-14 font-medium text-ems-blue text-lg transition-colors duration-300 ease-out hover:bg-ems-blue hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5.5v13a1 1 0 001.5.86l11-6.5a1 1 0 000-1.72l-11-6.5A1 1 0 008 5.5z" />
                </svg>
                Ver testimonio
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={video ? `Video: ${video.titulo}` : "Video"}
        onClose={() => videoRef.current?.pause()}
        onClick={(e) => e.target === dialogRef.current && cerrarVideo()}
        className="w-auto max-w-[min(92vw,1100px)] bg-transparent p-0 backdrop:bg-black/80"
      >
        <div className="relative">
          <button
            type="button"
            onClick={cerrarVideo}
            className="absolute -top-12 right-0 font-articulat font-medium text-white text-lg hover:underline"
          >
            Cerrar ✕
          </button>
          {video && (
            <video
              ref={videoRef}
              key={video.src}
              src={video.src}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] w-full rounded-[10px] bg-black"
            />
          )}
        </div>
      </dialog>
    </section>
  );
}
