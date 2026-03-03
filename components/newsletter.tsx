"use client";

import Link from "next/link";
import Logo from "./ui/logo";
import { motion, Variants } from "framer-motion";

export default function Newsletter() {
  
  const particleVariants: Variants = {
    animate: {
      y: [0, -40, 0],
      x: [0, 20, 0],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }
  };

  return (
    <section>
      <div className="max-w-full mb-0 md:p-10 p-4">
        <div className="pb-0">
          
          {/* Main Container with Gradient Border Wrapper */}
          <motion.div
            className="relative p-[1px] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Animated Gradient Border Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-ems-gold via-ems-red to-ems-gold bg-[length:200%_auto] animate-text-gradient opacity-75"></div>

            {/* Content Container (Inner) */}
            <div className="relative bg-gray-900 rounded-2xl px-8 py-10 md:py-16 md:px-16 overflow-hidden">
                
                {/* Background Decor: Rich Gradient & Particles */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                     {/* Deep Background Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-ems-primary/40"></div>
                     
                     {/* Subtle Dot Pattern */}
                     <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-5"></div>

                     {/* Floating Particles */}
                     <motion.div 
                        className="absolute top-10 left-10 w-32 h-32 bg-ems-gold/20 rounded-full blur-3xl"
                        variants={particleVariants}
                        animate="animate"
                     />
                     <motion.div 
                        className="absolute bottom-10 right-10 w-48 h-48 bg-ems-red/10 rounded-full blur-3xl"
                        variants={particleVariants}
                        animate="animate"
                        transition={{ delay: 2, duration: 10 }}
                     />
                </div>

                <div
                  id="inscript"
                  className="relative flex flex-col lg:flex-row justify-between items-center z-10 gap-8">
                  
                  {/* Text Content */}
                  <div className="text-center lg:text-left lg:max-w-xl">
                    <motion.h3 
                        className="text-3xl md:text-5xl font-extrabold font-ems-normal mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-ems-beige to-ems-yellow"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                      Queres ser parte de la EMS?
                    </motion.h3>
                    <motion.p 
                        className="text-ems-beige/80 text-lg md:text-xl mb-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                      Inscribite y convertite en el avivador que fuiste creado para ser.
                    </motion.p>

                    {/* Button */}
                    <div className="flex justify-center lg:justify-start">
                        <motion.a
                          className="btn text-white bg-ems-gold hover:bg-ems-gold/90 w-full sm:w-auto px-10 py-4 text-lg shadow-[0_0_20px_rgba(242,171,40,0.5)] hover:shadow-[0_0_30px_rgba(242,171,40,0.7)] transition-all duration-300 rounded-full font-ems-light border border-ems-gold/30 backdrop-blur-sm"
                          href="https://docs.google.com/forms/d/e/1FAIpQLSdPqwiE3WVKdDoyjEgFoNfV43rMLgWzDdLrwSbOCny9dp7oaA/viewform"
                          target="_blank"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Inscribirse Ahora
                        </motion.a>
                    </div>
                  </div>

                  {/* Logo / Image */}
                  <Link href="/">
                    <motion.img
                      src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1706961957/logo_j5zufy-Photoroom.png-Photoroom_op8fmv.png"
                      alt="logo"
                      className="w-48 md:w-64 opacity-90 drop-shadow-2xl"
                      whileHover={{ scale: 1.1, rotate: 5, filter: "brightness(1.2)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </Link>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
