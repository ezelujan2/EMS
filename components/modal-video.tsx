"use client";
import { useEffect, useState } from "react";

export default function ModalVideo() {
    const images = [
        "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988701/_DSC0891_qzcl2f.jpg",
        "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708989208/DSC_3841_eyfcmj.jpg",
        "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988699/_DSC4846_uujffe.jpg",
        "https://res.cloudinary.com/dmoqzhgjk/image/upload/v1708988776/DSC_4095_ibovtl.jpg",
		"https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737732011/_DSC7787_faolth.jpg"
    ];

    const [currentImage, setCurrentImage] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); 
    
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="w-full">
            <div className="relative flex justify-center mb-8 w-full" data-aos="zoom-y-out" data-aos-delay="450">
                <div className="flex flex-col justify-center items-center">
                    {/* Imagen con transición */}
                    <img
                        src={images[currentImage]}
                        className={`h-full md:h-full w-full opacity-95 transition-opacity duration-1000 ease-in-out ${
                            "opacity-90"
                        }`}
                        alt="current"
                    />
                    {/* Contenido */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                        <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16 z-0">
                            <h1 className="hidden md:flex text-2xl md:text-8xl mb-12" style={{ opacity: 1 }}>
                                El Reino de Dios se ha acercado
                            </h1>
                            <p className="hidden md:flex text-xl text-transparent text-white" style={{ opacity: 1 }}>
                                Experimenta la manifestación de la vida de Cristo y encuentra la plenitud como hijo, en una relación correcta con el Padre.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
