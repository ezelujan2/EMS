"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const contenedor: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const boton =
  "flex h-14 xl:h-[65px] w-full items-center justify-center gap-2 rounded-[10px] font-articulat font-medium text-lg xl:text-[22px] transition-colors duration-300 ease-out";

export default function Hero() {
  return (
    <section className="relative bg-white">
      <motion.div
        className="mx-auto max-w-[1053px] px-4 sm:px-6 pt-32 md:pt-40 xl:pt-[254px] pb-14 xl:pb-[72px] text-center"
        initial="hidden"
        animate="visible"
        variants={contenedor}
      >
        <motion.h1 id="home" variants={item}>
          <Image
            src="/ems27/ems27.png"
            alt="EMS'27"
            width={1190}
            height={345}
            priority
            className="mx-auto h-auto w-[min(595px,82vw)]"
          />
          <span className="sr-only">Escuela de Ministerio Sobrenatural 2027</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-8 xl:mt-[66px] max-w-[932px] font-articulat font-medium text-ems-muted text-lg leading-relaxed md:text-2xl md:leading-[1.55] xl:text-[28px] xl:leading-[45px]"
        >
          Nuestra misión es formar a los creyentes en su identidad como hijos de un buen Padre, y
          como resultado de esta relación, puedan co-participar con Él en la manifestación de su
          reino en cada lugar donde se muevan.
        </motion.p>

        <motion.div
          variants={item}
          className="mx-auto mt-10 xl:mt-[85px] grid max-w-xs gap-4 sm:max-w-none sm:grid-cols-3 sm:gap-6 xl:gap-[45px]"
        >
          <Link href="#testimonios" className={`${boton} bg-ems-blue text-white hover:bg-[#5F86F5]`}>
            Testimonios
          </Link>
          <Link href="/inscripcion" className={`${boton} bg-ems-sun text-white hover:bg-[#F0B400]`}>
            Inscripciones
          </Link>
          <a
            href="/documents/EMS Temario 2026.pdf"
            download="EMS_Temario.pdf"
            className={`${boton} border-[3px] border-ems-blue text-ems-blue hover:bg-ems-blue hover:text-white`}
          >
            <svg className="h-5 w-5 xl:h-6 xl:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
            </svg>
            Temario EMS
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-12 xl:mt-[52px] flex flex-col items-center gap-5 xl:gap-[27px]">
          <Image
            src="/ems27/globo.png"
            alt=""
            width={290}
            height={229}
            className="h-auto w-[110px] xl:w-[145px]"
          />
          <Image
            src="/ems27/iconos.png"
            alt=""
            width={589}
            height={135}
            className="h-auto w-[190px] xl:w-[229px]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
