import "./css/style.css";

import type { Metadata } from "next";
import localFont from 'next/font/local';

import Header from "@/components/ui/header";
import Banner from "@/components/banner";
import { Analytics } from "@vercel/analytics/react"

const inter = localFont({
  src: "../public/ems-fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  display: "swap",
});

// Fuente de la identidad EMS'27 (Articulat CF).
const articulat = localFont({
  src: [
    { path: "../public/ems-fonts/articulat/articulat-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/ems-fonts/articulat/articulat-medium.woff2", weight: "500", style: "normal" },
    { path: "../public/ems-fonts/articulat/articulat-demibold.woff2", weight: "600", style: "normal" },
    { path: "../public/ems-fonts/articulat/articulat-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-articulat",
  display: "swap",
});

// Dirección pública del sitio: en Vercel (producción) y Netlify (pruebas) se detecta sola.
const SITIO =
  process.env.NEXT_PUBLIC_SITIO_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
  process.env.URL ??
  "http://localhost:3000";

const NOMBRE = "Escuela de Ministerio Sobrenatural";
const DESCRIPCION =
  "Escuela de Ministerio Sobrenatural (EMS) en Rosario. Formamos a los creyentes en su identidad como hijos de un buen Padre para manifestar el Reino de Dios donde se muevan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: { default: NOMBRE, template: `%s | ${NOMBRE}` },
  description: DESCRIPCION,
  keywords: ["escuela", "ministerio", "sobrenatural", "EMS", "iglesia", "Rosario", "presencia", "poder", "sanidad", "profecía"],
  authors: [{ name: NOMBRE }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: NOMBRE,
    title: NOMBRE,
    description: DESCRIPCION,
    url: "/",
    images: [{ url: "/ems27/og.png", width: 1200, height: 630, alt: "EMS'27 - Escuela de Ministerio Sobrenatural" }],
  },
  twitter: {
    card: "summary_large_image",
    title: NOMBRE,
    description: DESCRIPCION,
    images: ["/ems27/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${articulat.variable} font-articulat antialiased bg-white text-gray-900 tracking-tight`}>
        <section className="relative z-10">
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
			<Analytics />
            <Banner />
          </div>
        </section>
      </body>
    </html>
  );
}
