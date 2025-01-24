import "./css/style.css";

import { Inter } from "next/font/google";

import Header from "@/components/ui/header";
import Banner from "@/components/banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Escuela de ministerio Sobrenatural",
  description: "Pagina Oficial de la escuela de ministerio sobrenatural",
  keywords:
    "escuela, ministerio, sobrenatural, iglesia, profecia, presencia, sanidad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737721668/logo_j5zufy_kenlzd_1_r9lvkz.ico"
        />
		 <link rel="apple-touch-icon" href="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1737721668/logo_j5zufy_kenlzd_1_r9lvkz.ico" />
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
      <body
        className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}>
        <section>
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
            <Banner />
          </div>
        </section>
      </body>
    </html>
  );
}
