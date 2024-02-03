import { useState } from "react";
import Logo from "./logo";

export default function Footer() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  function handleSent(event: any) {
    event?.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage("");
    }, 6000);
  }

  function handleInput(event: any) {
    setMessage(event.target.value);
  }
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex-col md:flex-row font-ems-normal">
        {/* Top area: Blocks */}
        {/* <div className="flex flex-col md:flex-row md:justify-between md:items-center md:space-between md:gap-8 py-8 md:py-12 border-t border-gray-200">
          <div className="md:w-1/3">
            <h6 className="text-gray-800 font-medium mb-2 ">Contactanos</h6>
            <p className="text-sm text-gray-600">
              Si tienes dudas o preguntas, ¡no dudes en escribirnos!
            </p>
            <span className="text-xs text-gray-600 mb-4">
              No te olvides de dejarnos un canal de contacto
            </span>
            <form>
              <div className="flex flex-wrap mb-4">
                <div className="w-full">
                  <label className="block text-sm sr-only" htmlFor="newsletter">
                    Mensaje
                  </label>
                  <div className="relative flex items-center max-w-xs">
                    <textarea
                      value={message}
                      onChange={handleInput}
                      id="newsletter"
                      className="form-input w-full text-gray-800 px-3 py-2 pr-12 text-sm"
                      placeholder="Tu mensaje..."
                      required
                    />
                    <button
                      onClick={handleSent}
                      type="submit"
                      className="absolute inset-0 left-auto"
                      aria-label="Subscribe">
                      <span
                        className="absolute inset-0 right-auto w-px -ml-px my-2 bg-gray-300"
                        aria-hidden="true"></span>
                      <svg
                        className="w-3 h-3 fill-current text-blue-600 mx-3 shrink-0"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </button>
                  </div>

                  {sent ? (
                    <p className="mt-2 text-green-600 text-sm">
                      Recibimos tu consulta!
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="md:w-1/3 flex  justify-center items-center mt-6 md:mt-0">
            <ul className="text-sm">
              <li className="mb-2">
                <h6 className="text-gray-800 h6 underline font-medium mb-2">
                  Recursos
                </h6>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Inscripcion
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Nuestros Valores
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Que es la EMS?
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Video
                </a>
              </li>
            </ul>
          </div>

          <div className="md:w-1/3 flex justify-end">
            <div className="mb-2">
              <Logo />
            </div>
          </div>
        </div> */}

        <div className="flex flex-col md:flex-row md:justify-between items-start mt-5">
          <div className="" id="contact">
            <h6 className="text-gray-800 font-medium mb-2 ">Contactanos</h6>
            <p className="text-sm text-gray-600">
              Si tienes dudas o preguntas, ¡no dudes en escribirnos!
            </p>
            <span className="text-xs text-gray-600 mb-4">
              No te olvides de dejarnos un canal de contacto
            </span>
            <form>
              <div className="flex flex-wrap mb-4">
                <div className="w-full">
                  <label className="block text-sm sr-only" htmlFor="newsletter">
                    Mensaje
                  </label>
                  <div className="relative flex items-center max-w-xs">
                    <textarea
                      value={message}
                      onChange={handleInput}
                      id="newsletter"
                      className="form-input w-full text-gray-800 px-3 py-2 pr-12 text-sm"
                      placeholder="Tu mensaje..."
                      required
                    />
                    <button
                      onClick={handleSent}
                      type="submit"
                      className="absolute inset-0 left-auto"
                      aria-label="Subscribe">
                      <span
                        className="absolute inset-0 right-auto w-px -ml-px my-2 bg-gray-300"
                        aria-hidden="true"></span>
                      <svg
                        className="w-3 h-3 fill-current text-blue-600 mx-3 shrink-0"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </button>
                  </div>

                  {sent ? (
                    <p className="mt-2 text-green-600 text-sm">
                      Recibimos tu consulta!
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="">
            <ul className="text-sm">
              <li className="mb-2">
                <h6 className="text-gray-800 h6 underline font-medium mb-2">
                  Recursos
                </h6>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Inscripcion
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Nuestros Valores
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Que es la EMS?
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#0"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Video
                </a>
              </li>
            </ul>
          </div>
          <div className="">
            <div className="mb-2">
              <Logo />
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li className="ml-4">
              <a
                href="https://www.instagram.com/ems.rosario/"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Facebook">
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 -8 25 38"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9962 0.0078125C8.73824 0.0078125 8.32971 0.021622 7.05019 0.080003C5.77333 0.138241 4.90129 0.341051 4.13824 0.637622C3.34938 0.944146 2.68038 1.35434 2.01343 2.02124C1.34652 2.68819 0.936333 3.35719 0.629809 4.14605C0.333238 4.9091 0.130429 5.78115 0.0721905 7.058C0.0138095 8.33753 0 8.74605 0 12.0041C0 15.262 0.0138095 15.6705 0.0721905 16.9501C0.130429 18.2269 0.333238 19.099 0.629809 19.862C0.936333 20.6509 1.34652 21.3199 2.01343 21.9868C2.68038 22.6537 3.34938 23.0639 4.13824 23.3705C4.90129 23.667 5.77333 23.8698 7.05019 23.9281C8.32971 23.9864 8.73824 24.0002 11.9962 24.0002C15.2542 24.0002 15.6627 23.9864 16.9422 23.9281C18.2191 23.8698 19.0911 23.667 19.8542 23.3705C20.643 23.0639 21.312 22.6537 21.979 21.9868C22.6459 21.3199 23.0561 20.6509 23.3627 19.862C23.6592 19.099 23.862 18.2269 23.9202 16.9501C23.9786 15.6705 23.9924 15.262 23.9924 12.0041C23.9924 8.74605 23.9786 8.33753 23.9202 7.058C23.862 5.78115 23.6592 4.9091 23.3627 4.14605C23.0561 3.35719 22.6459 2.68819 21.979 2.02124C21.312 1.35434 20.643 0.944146 19.8542 0.637622C19.0911 0.341051 18.2191 0.138241 16.9422 0.080003C15.6627 0.021622 15.2542 0.0078125 11.9962 0.0078125ZM11.9962 2.16929C15.1993 2.16929 15.5788 2.18153 16.8437 2.23924C18.0133 2.29257 18.6485 2.488 19.0712 2.65229C19.6312 2.86991 20.0308 3.12986 20.4506 3.54967C20.8704 3.96943 21.1303 4.36905 21.348 4.929C21.5122 5.35172 21.7077 5.98691 21.761 7.15653C21.8187 8.42148 21.831 8.80091 21.831 12.0041C21.831 15.2071 21.8187 15.5866 21.761 16.8515C21.7077 18.0211 21.5122 18.6563 21.348 19.0791C21.1303 19.639 20.8704 20.0386 20.4506 20.4584C20.0308 20.8782 19.6312 21.1381 19.0712 21.3558C18.6485 21.5201 18.0133 21.7155 16.8437 21.7688C15.579 21.8265 15.1996 21.8388 11.9962 21.8388C8.79286 21.8388 8.41352 21.8265 7.14871 21.7688C5.97909 21.7155 5.3439 21.5201 4.92119 21.3558C4.36124 21.1381 3.96162 20.8782 3.54186 20.4584C3.1221 20.0386 2.8621 19.639 2.64448 19.0791C2.48019 18.6563 2.28476 18.0211 2.23143 16.8515C2.17371 15.5866 2.16148 15.2071 2.16148 12.0041C2.16148 8.80091 2.17371 8.42148 2.23143 7.15653C2.28476 5.98691 2.48019 5.35172 2.64448 4.929C2.8621 4.36905 3.12205 3.96943 3.54186 3.54967C3.96162 3.12986 4.36124 2.86991 4.92119 2.65229C5.3439 2.488 5.97909 2.29257 7.14871 2.23924C8.41367 2.18153 8.7931 2.16929 11.9962 2.16929ZM11.9962 16.0028C9.78776 16.0028 7.99748 14.2125 7.99748 12.0041C7.99748 9.79558 9.78776 8.00529 11.9962 8.00529C14.2047 8.00529 15.995 9.79558 15.995 12.0041C15.995 14.2125 14.2047 16.0028 11.9962 16.0028ZM11.9962 5.84381C8.594 5.84381 5.836 8.60181 5.836 12.0041C5.836 15.4062 8.594 18.1642 11.9962 18.1642C15.3984 18.1642 18.1564 15.4062 18.1564 12.0041C18.1564 8.60181 15.3984 5.84381 11.9962 5.84381ZM18.3998 7.03996C19.1949 7.03996 19.8394 6.39548 19.8394 5.60043C19.8394 4.80538 19.1949 4.16086 18.3998 4.16086C17.6048 4.16086 16.9603 4.80538 16.9603 5.60043C16.9603 6.39548 17.6048 7.03996 18.3998 7.03996Z" />
                </svg>
              </a>
            </li>

            <li className="ml-4">
              <a
                href="#0"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Facebook">
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
                </svg>
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-gray-600 mr-4">
            &copy; Cruip.com. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
