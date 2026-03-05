"use client";

import { motion, Variants } from "framer-motion";
import { GarabatoSmiley, GarabatoHighlight, GarabatoSparkle } from "./ui/garabatos";

export default function Hero() {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Subtle Dot Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
          
          {/* Brand Glow - Top Center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-ems-primary/10 blur-[120px] rounded-full mix-blend-multiply"></div>

          {/* Garabatos (Removed to declutter background) */}
          <div className="hidden md:block pointer-events-none z-0">
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          
          <motion.div 
              className="text-center pb-12 md:pb-16"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
          >
            <motion.h1 
              id="home"
              className="text-5xl md:text-7xl font-extrabold text-ems-primary mb-6 leading-tight tracking-tight drop-shadow-sm"
              variants={itemVariants}
            >
                Escuela de Ministerio Sobrenatural
            </motion.h1>

            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed"
                variants={itemVariants}
              >
                Nuestra misión es formar a los creyentes en su identidad como
                hijos de un buen Padre, y como resultado de esta relación,
                puedan co-participar con Él en la manifestación de su reino en
                cada lugar donde se muevan.
              </motion.p>
              
              <div
                className="max-w-xs mx-auto sm:max-w-none grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <motion.div variants={itemVariants} className="w-full">
                  <a
                    className="btn text-white bg-ems-gold hover:bg-ems-gold/90 w-full px-4 py-4 shadow-lg shadow-ems-gold/40 hover:shadow-ems-gold/60 transition-all duration-300 transform hover:-translate-y-0.5 rounded-lg text-lg text-center"
                    href="#testimonios">
                    Testimonios
                  </a>
                </motion.div>
                <motion.div variants={itemVariants} className="w-full">
                  <a
                    className="btn text-white bg-gray-900 hover:bg-gray-800 w-full px-4 py-4 shadow-lg shadow-gray-900/40 hover:shadow-gray-900/60 transition-all duration-300 transform hover:-translate-y-0.5 rounded-lg text-lg text-center"
                    href="#inscript">
                    Inscripciones
                  </a>
                </motion.div>
                <motion.div variants={itemVariants} className="w-full">
                  <a
                    className="btn text-white bg-ems-primary hover:bg-ems-primary/90 w-full px-4 py-4 shadow-lg shadow-ems-primary/40 hover:shadow-ems-primary/60 transition-all duration-300 transform hover:-translate-y-0.5 rounded-lg text-lg flex items-center justify-center gap-2"
                    href="/documents/EMS Temario 2026.pdf"
                    download="EMS_Temario_2026.pdf">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    <span>Temario EMS</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
