"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Llamado a inscribirse.
export default function Newsletter() {
  return (
    <section className="px-4 sm:px-6 pt-24 md:pt-36 pb-16 md:pb-24">
      <motion.div
        id="inscript"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-[1500px] rounded-[10px] bg-ems-blue px-6 py-14 md:px-16 md:py-20"
      >
        <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-3xl font-articulat">
            <h2 className="font-bold text-white text-4xl md:text-6xl leading-tight">
              ¿Querés ser parte de la EMS?
            </h2>
            <p className="mt-4 font-medium text-ems-offwhite text-lg md:text-2xl">
              Inscribite y convertite en el avivador que fuiste creado para ser.
            </p>
            <Link
              href="/inscripcion"
              className="mt-8 inline-flex h-14 xl:h-[65px] items-center justify-center gap-3 rounded-[10px] bg-ems-sun px-10 font-medium text-white text-lg xl:text-[22px] transition-colors duration-300 ease-out hover:bg-[#F0B400]"
            >
              Inscribirme ahora
              <svg className="w-5" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M1 7h21M16 1l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <Image
            src="/ems27/logo.png"
            alt="EMS"
            width={218}
            height={218}
            className="w-36 md:w-48 h-auto shrink-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
