"use client";

import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import FeaturesBg from "@/public/images/features-bg.png";
import FeaturesElement from "@/public/images/features-element.png";
import presencia from "../public/images/presencia.jpg";
import transformacion from "../public/images/transformacion.jpg";
import poder from "../public/images/poder.jpg";
import comunidad from "../public/images/comunidad.jpg";
import classNames from "classnames";

export default function Features() {
  const [tab, setTab] = useState<number>(1);

  const tabs = useRef<HTMLDivElement>(null);

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement)
      tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
        aria-hidden="true"></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2 top-7"></div>

      <div className="relative max-w-full mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="text-4xl md:text-7xl mb-4">Que es la EMS?</h1>
            <p className="text-md md:text-xl text-gray-600">
              La identidad de la EMS, cada valor es un pilar de compromiso.
              Estos principios son más que palabras; son el núcleo de nuestra
              misión educativa.
            </p>
          </div>
        </div>
        <div className="flex md:flex-row flex-col-reverse">
          {/* Columna 1 */}
          <div className="w-full md:w-2/5 mx-auto m-2 md:m-0 flex justify-center items-center">
            <div className="rounded flex flex-col items-center p-5 border bg-white shadow-md border-gray-200 md:w-11/12">
              <h1 className="text-4xl md:text-5xl text-center mb-4">
                Presencia
              </h1>
              <div className="text-gray-600 md:text-lg text-sm text-center md:justify-start">
                Cultivar un ambiente donde cada persona se sienta valorada,
                escuchada y conectada, reflejando así el amor y la atención a
                Dios. Cultivar un ambiente donde cada persona se sienta
                valorada, escuchada y conectada, reflejando así el amor y la
                atención a Dios.
              </div>
              <svg
                className="mt-2 mx-auto md:mx-0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-3/5">
            <img
              className="w-full rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459548/presencia_w73zfs.jpg"
              alt="presencia"
            />
          </div>
        </div>

        <div className="mt-10 flex md:flex-row flex-col">
          {/* Columna 1 */}
          <div className="w-full md:w-3/5">
            <img
              className="w-full rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459547/poder_nro5cd.jpg"
              alt="poder"
            />
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-2/5 mx-auto m-2 md:m-0 flex justify-center items-center">
            <div className="rounded flex flex-col items-center p-5 border bg-white shadow-md border-gray-200 md:w-11/12">
              <h1 className="text-4xl md:text-5xl text-center">Poder</h1>
              <div className="text-gray-600 mt-3 md:text-lg text-sm text-center md:justify-start">
                Guiando a cada estudiante hacia un camino de impacto y propósito
                al servicio del Reino de Dios. Guiando a cada estudiante hacia
                un camino de impacto y propósito al servicio del Reino de Dios.
                Guiando a cada estudiante hacia un camino de impacto y propósito
                al servicio del Reino de Dios. Guiando a cada estudiante hacia
                un camino de impacto y propósito al servicio del Reino de Dios.
              </div>
              <svg
                className="mt-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse md:flex-row items-center h-full">
          {/* Columna 1 */}
          <div className="w-full md:w-2/5 mx-auto mb-4 md:mb-0 md:items-center flex items-center justify-center">
            <div className="rounded border bg-white shadow-md border-gray-200 p-4 md:p-5 m-2 md:m-10 mt-5">
              <h1 className="text-4xl md:text-5xl text-center mb-4">
                Comunidad
              </h1>
              <div className="text-gray-600 mt-3 md:text-lg text-sm justify-center md:justify-start">
                En comunidad las cosas se fortalecen cuando compartimos
                propósitos y sueños. Juntos, construimos un camino sólido hacia
                el crecimiento ministerial. En comunidad las cosas se fortalecen
                cuando compartimos propósitos y sueños. Juntos, construimos un
                camino sólido hacia el crecimiento ministerial.
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-2 mx-auto text-center">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-3/5">
            <img
              className="w-full rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459546/comunidad_wtzxvl.jpg"
              alt="presencia"
            />
          </div>
        </div>

        <div className="mt-10 flex md:flex-row flex-col">
          <div className="w-full md:w-3/5">
            <img
              className="w-full  rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459541/transformacion_ivnujl.jpg"
              alt="poder"
            />
          </div>
          <div className="w-11/12 m-2 md:m-0 md:w-2/5 flex justify-center items-center mx-4">
            <div className="rounded flex flex-col items-center p-5 border bg-white shadow-md border-gray-200 m-10">
              <h1 className="text-4xl md:text-5xl text-center">
                Transformación
              </h1>
              <div className="text-gray-600 mt-3 md:text-lg text-sm justify-center md:justify-start">
                Somos transformados gracias a su sacrificio en la cruz,
                conocerlo más nos ayuda a descubrirnos a nosotros mismos. Ser
                transformados es abrazar nuestro llamado
              </div>
              <svg
                className="mt-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
