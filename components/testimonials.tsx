import Image from "next/image";
import TestimonialImage from "@/public/images/testimonial.jpg";

export default function Testimonials() {
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
            <div className="text-center md:px-12 px-0 py-8 pt-20 mx-4 md:mx-0 max-w-3xl">
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
              <div className="text-gray-600 font-ems-light">
                <span>Alumnado Ems 2022</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-2/5 w-4/5 mt-20" data-aos="zoom-y-out">
          <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">
            {/* Testimonial */}
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
                convertirlo en mi mejor amigo. La Ems me enseño a poder
                relacionarme con el Espiritu Santo y convertirlo en mi mejor
                amigo“{" "}
              </blockquote>
              <cite className="block font-bold md:text-lg text-md not-italic mb-1 font-ems-bold">
                Flor Campagnolo
              </cite>
              <div className="text-gray-600 font-ems-normal">
                <span>Alumnado Ems 2022</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-2/5 w-4/5  mt-20" data-aos="zoom-y-out">
          <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">
            {/* Testimonial */}
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
        </div>
      </div>
    </section>
  );
}
