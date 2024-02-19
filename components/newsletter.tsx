import Link from "next/link";
import Logo from "./ui/logo";

export default function Newsletter() {
  return (
    <section>
      <div className="max-w-full mb-0">
        <div className="pb-0">
          {/* CTA box */}
          <div
            className="relative bg-gray-900 rounded pt-10 px-8 md:py-16 md:px-40 shadow-2xl overflow-hidden mb-0"
            data-aos="zoom-y-out">
            {/* Background illustration */}
            <div
              className="absolute right-0 bottom-0 pointer-events-none hidden lg:block"
              aria-hidden="true">
              <svg width="428" height="328" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient
                    cx="35.542%"
                    cy="34.553%"
                    fx="35.542%"
                    fy="34.553%"
                    r="96.031%"
                    id="ni-a">
                    <stop stopColor="#DFDFDF" offset="0%" />
                    <stop stopColor="#4C4C4C" offset="44.317%" />
                    <stop stopColor="#333" offset="100%" />
                  </radialGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                  <g fill="#FFF">
                    <ellipse
                      fillOpacity=".04"
                      cx="185"
                      cy="15.576"
                      rx="16"
                      ry="15.576"
                    />
                    <ellipse
                      fillOpacity=".24"
                      cx="100"
                      cy="68.402"
                      rx="24"
                      ry="23.364"
                    />
                    <ellipse
                      fillOpacity=".12"
                      cx="29"
                      cy="251.231"
                      rx="29"
                      ry="28.231"
                    />
                    <ellipse
                      fillOpacity=".64"
                      cx="29"
                      cy="251.231"
                      rx="8"
                      ry="7.788"
                    />
                    <ellipse
                      fillOpacity=".12"
                      cx="342"
                      cy="31.303"
                      rx="8"
                      ry="7.788"
                    />
                    <ellipse
                      fillOpacity=".48"
                      cx="62"
                      cy="126.811"
                      rx="2"
                      ry="1.947"
                    />
                    <ellipse
                      fillOpacity=".12"
                      cx="78"
                      cy="7.072"
                      rx="2"
                      ry="1.947"
                    />
                    <ellipse
                      fillOpacity=".64"
                      cx="185"
                      cy="15.576"
                      rx="6"
                      ry="5.841"
                    />
                  </g>
                  <circle fill="url(#ni-a)" cx="276" cy="237" r="200" />
                </g>
              </svg>
            </div>

            <div
              id="inscript"
              className="relative flex flex-col lg:flex-row justify-between items-center">
              {/* CTA content */}
              <div className="text-center lg:text-left lg:max-w-xl">
                <h3 className="h3 text-white mb-2 font-ems-normal">
                  Queres ser parte de la EMS?
                </h3>
                <p className="text-gray-300 text-lg mb-6 font-ems-light">
                  Inscribite y convertirte en el avivador que fuiste creado para
                  ser!
                </p>

                {/* CTA form */}
                <form className="w-full lg:w-auto">
                  <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                    <a
                      className="btn text-white bg-blue-600 hover:bg-blue-700 mb-6 shadow font-ems-normal"
                      href="https://docs.google.com/forms/d/e/1FAIpQLScDeqUpcN1Vo4O3I_04FShMvJ2yZONyqfvVtyBVNU7TUgk2GQ/viewform">
                      Inscribirse
                    </a>
                  </div>
                  {/* Success message */}
                  {/* <p className="text-sm text-gray-400 mt-3">Thanks for subscribing!</p> */}
                </form>
              </div>
              <Link href="/">
                <img
                  src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1706961957/logo_j5zufy-Photoroom.png-Photoroom_op8fmv.png"
                  alt="logo"
                  className=" md:w-64  hidden md:flex mr-14"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
