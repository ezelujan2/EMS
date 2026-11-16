"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { aBase64, enviar, errorArchivo, prepararArchivo } from "./archivos";
import { DOCUMENTOS, EMAIL_CONTACTO, MAX_ARCHIVO_MB } from "./config";

// Página a la que llega el link del mail para subir la carta pastoral después de inscribirse.
export default function SubirCarta() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const token = params.get("t") ?? "";
  const [archivo, setArchivo] = useState<File | null>(null);
  const [estado, setEstado] = useState<"elegir" | "preparando" | "enviando" | "listo">("elegir");
  const [error, setError] = useState("");

  if (!id || !token) {
    return (
      <p className="mt-6 text-gray-700">
        El link está incompleto. Abrilo de nuevo desde el mail que te enviamos o escribinos a{" "}
        <a href={`mailto:${EMAIL_CONTACTO}`} className="underline">
          {EMAIL_CONTACTO}
        </a>
        .
      </p>
    );
  }

  async function elegir(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setError("");
    if (!f) return;
    setEstado("preparando");
    const listo = await prepararArchivo(f);
    setEstado("elegir");
    const msg = errorArchivo(listo);
    setError(msg);
    setArchivo(msg ? null : listo);
  }

  async function subir() {
    if (!archivo) return setError("Elegí el archivo de la carta.");
    setEstado("enviando");
    setError("");
    try {
      const r = await enviar({ accion: "carta", id, token, archivo: await aBase64(archivo) });
      if (!r.ok) {
        setError(r.error || "No se pudo subir la carta.");
        setEstado("elegir");
        return;
      }
      setEstado("listo");
    } catch {
      setError(`No se pudo subir la carta. Probá de nuevo en unos minutos o enviala a ${EMAIL_CONTACTO}.`);
      setEstado("elegir");
    }
  }

  if (estado === "listo") {
    return (
      <div className="mt-6 rounded-[10px] border border-gray-200 bg-white px-5 sm:px-10 py-10 shadow-sm">
        <h2 className="text-2xl font-bold text-ems-blue">¡Recibimos tu carta!</h2>
        <p className="mt-3 text-gray-700">
          Tu inscripción ya está completa. Nos vamos a comunicar con vos para coordinar la entrevista.
        </p>
        <Link href="/" className="mt-6 inline-block font-medium text-ems-blue underline underline-offset-4">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[10px] border border-gray-200 bg-white px-5 sm:px-10 py-8 shadow-sm space-y-6">
      <p className="text-gray-700">
        Subí la carta pastoral firmada por tu pastor para completar tu inscripción.
        {DOCUMENTOS.cartaPastoral && (
          <>
            {" "}
            Si todavía no la tenés,{" "}
            <a href={DOCUMENTOS.cartaPastoral} download="Carta pastoral EMS 2027.pdf" className="text-ems-blue underline">
              descargala acá
            </a>
            .
          </>
        )}
      </p>

      <div
        className={`relative flex flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ems-blue/40 ${
          archivo ? "border-ems-blue bg-ems-blue/5" : error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-ems-blue/60"
        }`}
      >
        {estado === "preparando" ? (
          <span className="font-medium text-gray-700">Preparando el archivo...</span>
        ) : archivo ? (
          <>
            <span className="font-medium text-gray-900 break-all">{archivo.name}</span>
            <span className="text-sm text-ems-blue underline underline-offset-2">Cambiar archivo</span>
          </>
        ) : (
          <>
            <span className="font-medium text-gray-900">
              <span className="text-ems-blue underline underline-offset-2">Elegí el archivo</span> o arrastralo acá
            </span>
            <span className="text-sm text-gray-500">PDF o foto, de hasta {MAX_ARCHIVO_MB} MB</span>
          </>
        )}
        <input
          type="file"
          accept="application/pdf,image/*,.heic,.heif"
          onChange={elegir}
          aria-label="Carta pastoral"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={subir}
        disabled={estado !== "elegir"}
        className="h-12 w-full sm:w-auto px-6 rounded-[10px] bg-ems-sun font-semibold text-gray-900 transition-colors duration-300 hover:bg-[#F0B400] disabled:opacity-50"
      >
        {estado === "enviando" ? "Subiendo..." : "Enviar carta"}
      </button>
    </div>
  );
}
