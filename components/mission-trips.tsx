"use client";

import { motion } from "framer-motion";

export default function MissionTrips() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gray-100 pointer-events-none mb-16" aria-hidden="true"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <motion.h2 
                className="h2 mb-4" 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Viajes Misioneros EMS
            </motion.h2>
            <motion.p 
                className="text-xl text-gray-600" 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
              En la Escuela de Ministerio Sobrenatural, creemos en llevar el amor
              del Padre a las naciones. Nuestros viajes misioneros son una
              oportunidad práctica para que los estudiantes activen su identidad
              y compartan el evangelio, manifestando el Reino de los Cielos
              dondequiera que vayan.
            </motion.p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
            {/* 1st item */}
            <motion.div
              className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded bg-gray-200">
                 {/* Placeholder for user image */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Foto 1
                 </div>
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Misión Local
              </h4>
              <p className="text-gray-600 text-center">
                Impactando nuestra ciudad con actos de servicio y poder.
              </p>
            </motion.div>

            {/* 2nd item */}
            <motion.div
              className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
             <div className="relative w-full h-48 mb-4 overflow-hidden rounded bg-gray-200">
                 {/* Placeholder for user image */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Foto 2
                 </div>
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Viajes Nacionales
              </h4>
              <p className="text-gray-600 text-center">
                Llevando el avivamiento a otras provincias de nuestra nación.
              </p>
            </motion.div>

            {/* 3rd item */}
            <motion.div
              className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded bg-gray-200">
                 {/* Placeholder for user image */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Foto 3
                 </div>
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                A las Naciones
              </h4>
              <p className="text-gray-600 text-center">
                Obedeciendo el mandato de ir por todo el mundo y predicar.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
