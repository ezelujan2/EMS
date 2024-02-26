"use client";
import Image from "next/image";
import TestimonialImage from "@/public/images/testimonial.jpg";
import { useState } from "react";

export default function Testimonials() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const [expanded1, setExpanded1] = useState(false);

  const handleToggle1 = () => {
    setExpanded1(!expanded1);
  };

  return (
    <section className="relative">
      <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16 md:mt-32 mt-2">
        <h2 className="h2 mb-4 font-ems-normal">Testimonios</h2>
        <p
          className="text-xl text-gray-600 font-ems-light"
          data-aos="zoom-y-out">
          Arcu cursus vitae congue mauris rhoncus viverra nibh cras pulvinar
          mattis blandit libero cursus mattis.
        </p>
      </div>
      {/* Illustration behind content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -mb-32"
        aria-hidden="true">
        <svg
          width="1760"
          height="518"
          viewBox="0 0 1760 518"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-02">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g
            transform="translate(0 -3)"
            fill="url(#illustration-02)"
            fillRule="evenodd">
            <circle cx="1630" cy="128" r="128" />
            <circle cx="178" cy="481" r="40" />
          </g>
        </svg>
      </div>

      <div className="flex md:flex-row md:flex-wrap flex-col items-center  md:justify-around w-full mb-10">
        {/* Testimonials */}
        <div className="md:w-2/5 w-4/5 mt-20" data-aos="zoom-y-out">
          <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">
            {/* Testimonial */}
            <div className="text-center md:px-12 px-0 py-8 pt-20 mx-4 md:mx-0 max-w-3xl relative">
              <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
                <svg
                  className="absolute top-0 right-0 -mt-3 -mr-8 w-16 h-16 fill-current text-blue-500"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.89 58.338c-2.648-5.63-3.572-10.045-2.774-13.249.8-3.203 8.711-13.383 23.737-30.538l2.135.532c-6.552 10.033-10.532 17.87-11.939 23.515-.583 2.34.22 6.158 2.41 11.457l-13.57 8.283zm-26.963-6.56c-2.648-5.63-3.572-10.046-2.773-13.25.799-3.203 8.71-13.382 23.736-30.538l2.136.533c-6.552 10.032-10.532 17.87-11.94 23.515-.583 2.339.22 6.158 2.41 11.456l-13.57 8.283z" />
                </svg>
                <Image
                  className="relative rounded-full"
                  src={TestimonialImage}
                  width={96}
                  height={96}
                  alt="Testimonial 01"
                />
              </div>
              <blockquote
                className={`md:text-xl text-md md:text-md font-medium mb-4 font-ems-light-oblique ${
                  expanded ? "expanded" : ""
                }`}>
                “ A mi me paso que en la EMS siento que llegue a conocer
                muchísimo más a Jesús. Y entendí que eso implica tener una
                relación con El. Lo cual es hermoso y esta disponible para
                todos, y todo el tiempo. Descubrí un amor que nunca imaginé. Una
                relación tan hermosa que transformo mi vida por completo.
                Entendí por fin a que se refieren cuando dicen “nacer de nuevo”,
                siento que antes vivía, pero no estaba realmente “viva”, y ahora
                sí. Tuve la posibilidad de tener mucho más tiempo de intimidad
                con El. Pasar tiempo juntos es lo que fue haciendo un trabajo
                profundo en mí. Estar en su presencia es lo que más me empezó a
                alimentar, a sanar y a llenar. Entendí que nada se compara.
                Hacía tiempo había recibido una palabra, que decía que yo iba a
                ser como un árbol plantado a la orilla del rio, no temerá cuando
                venga el calor y sus hojas estarán verdes, no se angustiara en
                año de sequía y siempre dará frutos. Y así siento que fue,
                siento que fue un año de echar raíces profundas con El y
                afirmarme en su amor. “
              </blockquote>
              {
                <button
                  className="text-blue-500 font-bold hover:underline focus:outline-none"
                  onClick={handleToggle}>
                  {expanded ? "Ver menos" : "Ver más"}
                </button>
              }
              <cite className="block font-bold md:text-lg text-md not-italic mb-1 font-ems-bold">
                Flor Campagnolo
              </cite>
              <div className="text-gray-600 font-ems-light">
                <span>Alumnado Ems 2022</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-2/5 w-4/5 mt-20" data-aos="zoom-y-out">
          <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">
            {/* Testimonial */}
            <div className="text-center md:px-12 px-0 py-8 pt-20 mx-4 md:mx-0 max-w-3xl relative">
              <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
                <svg
                  className="absolute top-0 right-0 -mt-3 -mr-8 w-16 h-16 fill-current text-blue-500"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.89 58.338c-2.648-5.63-3.572-10.045-2.774-13.249.8-3.203 8.711-13.383 23.737-30.538l2.135.532c-6.552 10.033-10.532 17.87-11.939 23.515-.583 2.34.22 6.158 2.41 11.457l-13.57 8.283zm-26.963-6.56c-2.648-5.63-3.572-10.046-2.773-13.25.799-3.203 8.71-13.382 23.736-30.538l2.136.533c-6.552 10.032-10.532 17.87-11.94 23.515-.583 2.339.22 6.158 2.41 11.456l-13.57 8.283z" />
                </svg>
                <Image
                  className="relative rounded-full"
                  src={TestimonialImage}
                  width={96}
                  height={96}
                  alt="Testimonial 01"
                />
              </div>
              <blockquote
                className={`md:text-xl text-md md:text-md font-medium mb-4 font-ems-light-oblique ${
                  expanded1 ? "expanded" : ""
                }`}>
                “ A mi me paso que en la EMS siento que llegue a conocer
                muchísimo más a Jesús. Y entendí que eso implica tener una
                relación con El. Lo cual es hermoso y esta disponible para
                todos, y todo el tiempo. Descubrí un amor que nunca imaginé. Una
                relación tan hermosa que transformo mi vida por completo.
                Entendí por fin a que se refieren cuando dicen “nacer de nuevo”,
                siento que antes vivía, pero no estaba realmente “viva”, y ahora
                sí. Tuve la posibilidad de tener mucho más tiempo de intimidad
                con El. Pasar tiempo juntos es lo que fue haciendo un trabajo
                profundo en mí. Estar en su presencia es lo que más me empezó a
                alimentar, a sanar y a llenar. Entendí que nada se compara.
                Hacía tiempo había recibido una palabra, que decía que yo iba a
                ser como un árbol plantado a la orilla del rio, no temerá cuando
                venga el calor y sus hojas estarán verdes, no se angustiara en
                año de sequía y siempre dará frutos. Y así siento que fue,
                siento que fue un año de echar raíces profundas con El y
                afirmarme en su amor. “
              </blockquote>
              {
                <button
                  className="text-blue-500 font-bold hover:underline focus:outline-none"
                  onClick={handleToggle1}>
                  {expanded1 ? "Ver menos" : "Ver más"}
                </button>
              }
              <cite className="block font-bold md:text-lg text-md not-italic mb-1 font-ems-bold">
                Flor Campagnolo
              </cite>
              <div className="text-gray-600 font-ems-light">
                <span>Alumnado Ems 2022</span>
              </div>
            </div>
          </div>
        </div>

        {/* ULTIMO TESTIMONIAL  */}
        {/* <div className="md:w-2/5 w-4/5  mt-20" data-aos="zoom-y-out">
          <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">
            

            <div className="text-center md:px-12 px-0 py-8 pt-20 mx-4 md:mx-0">
              <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
                <svg
                  className="absolute top-0 right-0 -mt-3 -mr-8 w-16 h-16 fill-current text-blue-500"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.89 58.338c-2.648-5.63-3.572-10.045-2.774-13.249.8-3.203 8.711-13.383 23.737-30.538l2.135.532c-6.552 10.033-10.532 17.87-11.939 23.515-.583 2.34.22 6.158 2.41 11.457l-13.57 8.283zm-26.963-6.56c-2.648-5.63-3.572-10.046-2.773-13.25.799-3.203 8.71-13.382 23.736-30.538l2.136.533c-6.552 10.032-10.532 17.87-11.94 23.515-.583 2.339.22 6.158 2.41 11.456l-13.57 8.283z" />
                </svg>
                <Image
                  className="relative rounded-full"
                  src={TestimonialImage}
                  width={96}
                  height={96}
                  alt="Testimonial 01"
                />
              </div>
              <blockquote className="md:text-xl text-md md:text-md font-medium mb-4 font-ems-light-oblique">
                “ La Ems me enseño a poder relacionarme con el Espiritu Santo y
                convertirlo en mi mejor amigo “
              </blockquote>
              <cite className="block font-bold md:text-lg text-md not-italic mb-1 font-ems-bold">
                Flor Campagnolo
              </cite>
              <div className="text-gray-600 font-ems-normal">
                <span>Alumnado Ems 2022</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
