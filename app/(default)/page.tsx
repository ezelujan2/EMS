export const metadata = {
  title: "Escuela de Minsiterio Sobrenatural",
  description: "Pagina Oficial de la EMS",
  keywords:
    "escuela, ministerio, sobrenatural, iglesia, profecia, presencia, sanidad, rosario, oracion",
};

import Hero from "@/components/hero";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import ModalVideo from "@/components/modal-video";
import MissionTrips from "@/components/mission-trips";

export default function Home() {
  return (
    <>

      <Hero />
      <ModalVideo />
      <Features />
	  <MissionTrips />
      <Testimonials />
      <Newsletter />
    </>
  );
}
