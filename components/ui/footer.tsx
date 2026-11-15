import Image from "next/image";
import Link from "next/link";

const EMAIL = "infoescuelams@gmail.com";

const LINKS = [
  { href: "/inscripcion", texto: "Inscripción" },
  { href: "/#values", texto: "Nuestros valores" },
  { href: "/#testimonios", texto: "Testimonios" },
  { href: "/documents/EMS Temario 2026.pdf", texto: "Temario" },
];

export default function Footer() {
  return (
    <footer className="bg-ems-blue font-articulat text-ems-offwhite">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-[6%] min-[1700px]:px-0 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[auto_1fr_auto] md:gap-16">
          <Link href="/" className="flex items-center gap-4" aria-label="Inicio">
            <Image src="/ems27/logo.png" alt="EMS" width={218} height={218} className="w-20 h-auto" />
            <span className="font-medium text-lg leading-tight">
              Escuela de Ministerio
              <br />
              Sobrenatural
            </span>
          </Link>

          <div id="contact" className="scroll-mt-28">
            <h2 className="font-bold text-white text-xl">Contactanos</h2>
            <p className="mt-2 text-ems-offwhite/90">
              Si tenés dudas o preguntas, ¡no dudes en escribirnos!
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-1 inline-block font-medium text-white underline underline-offset-4">
              {EMAIL}
            </a>
          </div>

          <nav aria-label="Pie de página">
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline underline-offset-4">
                    {l.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-white/30 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Escuela de Ministerio Sobrenatural</p>
          <a
            href="https://www.instagram.com/ems.rosario/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white hover:underline underline-offset-4"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
            </svg>
            @ems.rosario
          </a>
        </div>
      </div>
    </footer>
  );
}
