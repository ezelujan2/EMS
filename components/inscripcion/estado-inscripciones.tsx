"use client";

import { useEffect, useState, type ReactNode } from "react";
import { APPS_SCRIPT_URL } from "./config";

type Estado = { cargando: true } | { cargando: false; abiertas: boolean; mensaje: string };

// Consulta en la planilla (pestaña Configuración) si las inscripciones están abiertas.
// Si la consulta falla o tarda demasiado, muestra el formulario igual:
// el script vuelve a revisarlo al recibir el envío.
export default function EstadoInscripciones({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>({ cargando: true });

  useEffect(() => {
    const ctrl = new AbortController();
    const limite = setTimeout(() => ctrl.abort(), 8000);
    fetch(APPS_SCRIPT_URL, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) =>
        setEstado({ cargando: false, abiertas: d.abiertas !== false, mensaje: String(d.mensajeCerradas ?? "") })
      )
      .catch(() => setEstado({ cargando: false, abiertas: true, mensaje: "" }))
      .finally(() => clearTimeout(limite));
    return () => {
      clearTimeout(limite);
      ctrl.abort();
    };
  }, []);

  if (estado.cargando) {
    return (
      <div className="mt-8 flex items-center gap-3 text-ems-muted" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-ems-blue/30 border-t-ems-blue" />
        Cargando el formulario...
      </div>
    );
  }

  if (!estado.abiertas) {
    return (
      <p className="mt-6 rounded-[10px] bg-ems-blue/10 px-5 py-4 text-gray-800 md:text-lg leading-relaxed">
        {estado.mensaje || "Las inscripciones están cerradas por el momento."}
      </p>
    );
  }

  return <>{children}</>;
}
