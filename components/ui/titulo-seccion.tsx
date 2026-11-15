import type { ReactNode } from "react";

// Encabezado de sección con el estilo EMS'27: título azul y bajada en gris.
export default function TituloSeccion({
  titulo,
  children,
  id,
}: {
  titulo: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="mx-auto max-w-3xl text-center scroll-mt-28">
      <h2 className="font-articulat font-bold text-ems-blue text-4xl md:text-6xl leading-tight">
        {titulo}
      </h2>
      {children && (
        <p className="mt-5 font-articulat font-medium text-ems-muted text-lg md:text-2xl leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}
