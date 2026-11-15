"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [top, setTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY <= 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 overflow-hidden transition-[height,box-shadow] duration-300 ease-out ${
        top ? "h-20 md:h-28 xl:h-[156px]" : "h-20 md:h-24 shadow-lg"
      }`}
    >
      <Image
        src="/ems27/fondo-banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center -z-10"
      />

      <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-[6%] min-[1700px]:px-0">
        <Link href="/" className="flex items-center gap-4 xl:gap-6 shrink-0" aria-label="Inicio">
          <Image
            src="/ems27/logo.png"
            alt="EMS"
            width={218}
            height={218}
            priority
            className={`h-auto transition-[width] duration-300 ease-out ${
              top ? "w-[52px] md:w-[80px] xl:w-[109px]" : "w-[52px] md:w-[68px]"
            }`}
          />
          <span className="hidden sm:block font-articulat font-medium text-ems-offwhite text-base leading-tight xl:text-[20px] xl:leading-[22px]">
            Escuela de Ministerio
            <br />
            Sobrenatural
          </span>
        </Link>

        <nav className="flex items-center gap-6 xl:gap-12">
          <Link
            href="/#contact"
            className="hidden md:block font-articulat font-medium text-ems-offwhite text-lg xl:text-[24px] xl:leading-[26px] underline-offset-8 decoration-2 hover:underline"
          >
            Contactanos
          </Link>
          <Link
            href="/inscripcion"
            className="group inline-flex items-center justify-center gap-2 xl:gap-3 rounded-[10px] border-2 xl:border-[3px] border-ems-offwhite px-4 h-10 md:h-12 xl:h-[58px] xl:w-[230px] font-articulat font-bold uppercase text-ems-offwhite text-sm md:text-base xl:text-[24px] transition-colors duration-300 ease-out hover:bg-ems-offwhite hover:text-ems-blue"
          >
            Inscribite
            <svg
              className="w-4 xl:w-6 transition-transform duration-300 ease-out group-hover:translate-x-1"
              viewBox="0 0 24 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M1 7h21M16 1l6 6-6 6" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
