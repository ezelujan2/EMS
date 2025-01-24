"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Features() {
  // const [tab, setTab] = useState<number>(1);

  const [modalOpen1, setModalOpen1] = useState<boolean>(false);
  const [modalOpen2, setModalOpen2] = useState<boolean>(false);
  const [modalOpen3, setModalOpen3] = useState<boolean>(false);
  const [modalOpen4, setModalOpen4] = useState<boolean>(false);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);

  const width = "100%";
  const height = "75vw";

        
        const thumbWidth=768
        const thumbHeight=432
        const thumbAlt="Modal video thumbnail"
        const videoWidth=1920
        const videoHeight=1080

  const tabs = useRef<HTMLDivElement>(null);

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement)
      tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section id='values' className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
        aria-hidden="true"></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-16 bg-gray-200 transform -translate-y-1/2 top-4"></div>

      <div className="relative max-w-full mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="text-4xl md:text-7xl mb-4 font-ems-normal">
              Qué es la EMS?
            </h1>
            <p className="text-md md:text-xl text-gray-600 font-ems-light">
              La identidad de la EMS. Cada valor es un pilar de compromiso.
              Estos principios son más que palabras; son el núcleo de nuestra
              misión como escuela.
            </p>
          </div>
        </div>
        <div className="flex md:flex-row flex-col-reverse">
          {/* Columna 1 */}
          <div className="w-full md:w-2/5 mx-auto m-2 md:m-0 flex justify-center items-center">
            <div className="rounded flex flex-col items-center p-5 border bg-white shadow-md border-gray-200 md:w-11/12">
              <h1 className="text-4xl md:text-5xl text-center mb-4 font-ems-normal">
                Presencia
              </h1>
              <div className="text-gray-600 md:text-lg text-sm text-center md:justify-start font-ems-light">
                Honramos la presencia de Dios y buscamos cultivar ambientes
                donde Él sea el centro. En ese lugar lo conocemos y descubrimos
                más de su bondad, de su belleza, de quién es Él. Mientras más lo
                conocemos, más experimentamos su verdad y su cercanía.
              </div>
              <a onClick={() => {
              setModalOpen1(true);
            }}>
              <svg
                className="mt-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
              </a >
              <Transition
        show={modalOpen1}
        as={Fragment}
        afterEnter={() => videoRef1.current?.play()}>
        <Dialog initialFocus={videoRef1} onClose={() => setModalOpen1(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}

          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ttransition ease-out duration-200"
            leaveFrom="oopacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="max-w-6xl mx-auto h-full flex items-center">
              <Dialog.Panel className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh] bg-black overflow-hidden">
                <video
                className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh]"
                  // ref={videoRef}
                  width={videoWidth}
                  height={videoHeight}
                  loop
                  controls>
                  <source src="/videos/Eze.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
              </Transition>
            </div>
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-3/5">
            <img
              className="w-full rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/t_Valores EMS/v1705459548/presencia_w73zfs.jpg"
              alt="presencia"
            />
          </div>
        </div>

        <div className="mt-10 flex md:flex-row flex-col">
          {/* Columna 1 */}
          <div className="w-full md:w-3/5">
            <img
              className="w-full rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/t_Valores EMS/v1705459541/transformacion_ivnujl.jpg"
              alt="poder"
            />
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-2/5 mx-auto m-2 md:m-0 flex justify-center items-center">
            <div className="rounded flex flex-col items-center p-5 border bg-white shadow-md border-gray-200 md:w-11/12">
              <h1 className="text-4xl md:text-5xl text-center font-ems-normal">
                Poder
              </h1>
              <div className="text-gray-600 mt-3 md:text-lg text-sm text-center md:justify-start font-ems-light">
			  Llamados a una vida de impacto y propósito al servicio del Reino de Dios, porque el evangelio, son buenas nuevas, y esas buenas nuevas, no vienen separadas de su poder.
			  Fuimos creados para vivir una vida sobrenatural.

              </div>
              <a onClick={() => {
              setModalOpen2(true);
            }}>
              <svg
                className="mt-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
              </a >
              <Transition
        show={modalOpen2}
        as={Fragment}
        afterEnter={() => videoRef2.current?.play()}>
        <Dialog initialFocus={videoRef2} onClose={() => setModalOpen2(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}

          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ttransition ease-out duration-200"
            leaveFrom="oopacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="max-w-6xl mx-auto h-full flex items-center">
              <Dialog.Panel className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh] bg-black overflow-hidden">
                <video
                className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh]"
                  ref={videoRef2}
                  width={videoWidth}
                  height={videoHeight}
                  loop
                  controls>
                  <source src="/videos/Dani.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
              </Transition>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse md:flex-row items-center h-full">
          {/* Columna 1 */}
          <div className="w-full md:w-2/5 mx-auto mb-4 md:mb-0 md:items-center flex items-center justify-center">
            <div className="rounded border bg-white shadow-md border-gray-200 p-4 md:p-5 m-2 md:m-10 mt-5">
              <h1 className="text-4xl md:text-5xl text-center mb-4 font-ems-normal">
                Comunidad
              </h1>
              <div className="text-gray-600 mt-3 md:text-lg text-sm justify-center md:justify-start font-ems-light">
			  Fuimos creados para vivir en su cuerpo, la iglesia. Esa familia y comunidad, donde somos conocidos y podemos conocer más a Jesús, donde Él se encarna en la manifestación de su cuerpo y podemos ver la simpleza de la gracia y el poder de la vulnerabilidad. 
              </div>
              <a onClick={() => {
              setModalOpen3(true);
            }}>
              <svg
                className="mt-2 m-auto"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
              </a >
              <Transition
        show={modalOpen3}
        as={Fragment}
        afterEnter={() => videoRef3.current?.play()}>
        <Dialog initialFocus={videoRef3} onClose={() => setModalOpen3(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}

          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ttransition ease-out duration-200"
            leaveFrom="oopacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="max-w-6xl mx-auto h-full flex items-center">
              <Dialog.Panel className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh] bg-black overflow-hidden">
                <video
                className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh]"
                  ref={videoRef3}
                  width={videoWidth}
                  height={videoHeight}
                  loop
                  controls>
                  <source src="/videos/Flor.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
              </Transition>
               
            </div>
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-3/5">
            <img
              className="w-full rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737719606/DSC03854_ynl6ml.jpg"
              alt="comunidad"
            />
          </div>
        </div>

        <div className="mt-10 flex md:flex-row flex-col">
          <div className="w-full md:w-3/5">
            <img
              className="w-full  rounded"
              src="https://res.cloudinary.com/dmoqzhgjk/image/upload/t_Valores EMS/v1705459547/poder_nro5cd.jpg"
              alt="Transformacion"
            />
          </div>
          <div className="w-11/12 m-2 md:m-0 md:w-2/5 flex justify-center items-center mx-4">
            <div className="rounded flex flex-col items-center p-5 border bg-white shadow-md border-gray-200 m-10">
              <h1 className="text-4xl md:text-5xl text-center font-ems-normal">
                Transformación
              </h1>
              <div className="text-gray-600 mt-3 md:text-lg text-sm justify-center md:justify-start font-ems-light">
			  Mientras más conocemos a Dios, más conocemos quienes somos como hijos. En su presencia somos transformados a la imagen de Jesús, el Hijo, que nos mostró lo que de verdad era vivir en una plena comunión con el Padre. El siempre nos lleva al diseño original.
              </div>
              <a onClick={() => {
              setModalOpen4(true);
            }}>
              <svg
                className="mt-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                  fill="currentColor"
                />
                <path
                  d="M16 12L10 16.3301V7.66987L16 12Z"
                  fill="currentColor"
                />
              </svg>
              </a >
              <Transition
        show={modalOpen4}
        as={Fragment}
        afterEnter={() => videoRef4.current?.play()}>
        <Dialog initialFocus={videoRef4} onClose={() => setModalOpen4(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}

          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ttransition ease-out duration-200"
            leaveFrom="oopacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="max-w-6xl mx-auto h-full flex items-center">
              <Dialog.Panel className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh] bg-black overflow-hidden">
                <video
                className="md:w-[100vh] md:max-h-[100vh] max-h-[50vh] w-[50vh]"
                  ref={videoRef4}
                  width={videoWidth}
                  height={videoHeight}
                  loop
                  controls>
                  <source src="/videos/Patri.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
              </Transition>
            </div>
          </div>
        </div>
      </div>
      <div id="testimonios" />
    </section>
  );
}
