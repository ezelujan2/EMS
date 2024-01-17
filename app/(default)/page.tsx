export const metadata = {
  title: "Home - Simple",
  description: "Page description",
};

import VideoThumb from "@/public/images/portada.jpg";
import Hero from "@/components/hero";
import Features from "@/components/features";
import FeaturesBlocks from "@/components/features-blocks";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import ModalVideo from "@/components/modal-video";

export default function Home() {
  return (
    <>
      <Hero />
      <ModalVideo
        thumb={VideoThumb}
        thumbWidth={768}
        thumbHeight={432}
        thumbAlt="Modal video thumbnail"
        video="/videos/video.mp4"
        videoWidth={1920}
        videoHeight={1080}
      />
      <Features />
      {/* <FeaturesBlocks /> */}
      {/* <Testimonials /> */}
      {/* <Newsletter /> */}
    </>
  );
}
