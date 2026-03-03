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

          {/* Garabatos (Sparingly applied) */}
          <div className="hidden md:block pointer-events-none z-0">
            <GarabatoSparkle className="absolute top-40 left-[18%] md:left-[18%] text-ems-yellow opacity-60 scale-75 md:scale-100" />
            <GarabatoHighlight className="absolute top-[18%] md:top-[25%] right-[5%] md:right-[20%] text-ems-lightBlue opacity-40 -rotate-6 scale-50 md:scale-100" />
            <GarabatoSmiley className="absolute bottom-16 md:bottom-16 left-[5%] md:left-[25%] text-ems-gold opacity-50 -rotate-12 scale-50 md:scale-75" />
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
              className="text-5xl md:text-7xl font-extrabold font-ems-normal text-ems-primary mb-6 leading-tight tracking-tight drop-shadow-sm"
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
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center gap-4"
              >
                <motion.div variants={itemVariants} className="w-full sm:w-auto">
                  <a
                    className="btn text-white bg-ems-gold hover:bg-ems-gold/90 w-full px-8 py-4 shadow-lg shadow-ems-gold/40 hover:shadow-ems-gold/60 transition-all duration-300 transform hover:-translate-y-0.5 font-ems-light rounded-lg text-lg"
                    href="#testimonios">
                    Testimonios
                  </a>
                </motion.div>
                <motion.div variants={itemVariants} className="w-full sm:w-auto mt-4 sm:mt-0">
                  <a
                    className="btn text-white bg-gray-900 hover:bg-gray-800 w-full px-8 py-4 shadow hover:shadow-lg transition-all duration-300 font-ems-light rounded-lg text-lg"
                    href="#inscript">
                    Inscripciones
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
