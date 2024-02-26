export const metadata = {
  title: "Escuela de Minsiterio Sobrenatural",
  description: "Pagina Oficial de la EMS",
};

import VideoThumb from "@/public/images/portada.jpg";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import ModalVideo from "@/components/modal-video";

export default function Home() {
  return (
    <>
      <head>
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459174/logo_j5zufy.jpg"
        />
        <meta
          property="og:image:secure_url"
          content="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459174/logo_j5zufy.jpg"
        />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="400" />
      </head>

      <Hero />
      <ModalVideo />
      <Features />
      {/* <FeaturesBlocks /> */}
      <Testimonials />
      <Newsletter />
    </>
  );
}
