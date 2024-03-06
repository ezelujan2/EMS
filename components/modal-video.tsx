"use client";
import { useState } from "react";

export default function ModalVideo() {
  const [index, setIndex] = useState(0);

  const images = [
    "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988701/_DSC0891_qzcl2f.jpg",
    "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708989208/DSC_3841_eyfcmj.jpg",
    "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988699/_DSC4846_uujffe.jpg",
    "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988776/DSC_4095_ibovtl.jpg",
  ];

  function increaseIndex() {
    if (index === images.length - 1) setIndex(0);
    else setIndex(index + 1);
  }

  function decreaseIndex() {
    if (index === 0) setIndex(images.length - 1);
    else setIndex(index - 1);
  }

  return (
    <div className="w-full">
      <div
        className="relative flex justify-center mb-8 w-full"
        data-aos="zoom-y-out"
        data-aos-delay="450">
        <div className="flex flex-col justify-center items-center">
          <img
            src={images[index]}
            className="h-full md:h-full w-full opacity-95"
            alt={"thumbAlt"}
          />
          {/* Content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            {index === 0 ? (
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16 z-0">
                <h1
                  className="text-2xl md:text-8xl md:flex hidden mb-12 font-ems-normal"
                  style={{ opacity: 1 }}>
                  El Reino de Dios se ha acercado
                </h1>
                <p
                  className="md:flex hidden text-xl text-transparent text-white font-ems-light"
                  style={{ opacity: 1 }}>
                  Comienza a experimentar el reino de Dios, donde la simpleza de
                  Su Gracia pone el Reino al alcance de tu mano. Experimenta la
                  manifestación de la vida de Cristo y encuentra la plenitud
                  como hijo, en una relación correcta con el Padre.
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* Arrows */}
          <div className="absolute bg-gray-200 opacity-30 border rounded-l hover:bg-white hover:opacity-100 top-1/3 md:top-1/2 right-1">
            <button onClick={increaseIndex} type="button" className="w-14 h-14 md:w-24 md:h-24">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          <div className="absolute bg-gray-200 opacity-30 border rounded-l hover:bg-white hover:opacity-100 top-1/3 md:top-1/2 left-1">
            <button onClick={decreaseIndex} type="button" className="w-14 h-14 md:w-24 md:h-24">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          {/* End: Arrows */}
        </div>
      </div>
    </div>
  );
}
