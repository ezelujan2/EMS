// Ayudas para la carta pastoral: preparar el archivo, guardarlo en el navegador y enviarlo.

import { APPS_SCRIPT_URL, MAX_ARCHIVO_MB } from "./config";

const LADO_MAXIMO = 2200; // px: alcanza para leer una carta y deja el archivo liviano

const esHeic = (f: File) => /\.(heic|heif)$/i.test(f.name) || /hei[cf]/i.test(f.type);

export function tipoValido(f: File) {
  return f.type === "application/pdf" || f.type.startsWith("image/") || esHeic(f);
}

export function errorArchivo(f: File): string {
  if (!tipoValido(f)) return "El archivo tiene que ser un PDF o una foto.";
  if (f.size > MAX_ARCHIVO_MB * 1024 * 1024) return `El archivo pesa más de ${MAX_ARCHIVO_MB} MB.`;
  return "";
}

/**
 * Las fotos se pasan a JPG y se achican: así pesan poco y se abren en cualquier computadora
 * (por ejemplo, las HEIC de iPhone). Si el navegador no puede leer la foto, se deja como está.
 * Los PDF no se tocan.
 */
export async function prepararArchivo(f: File): Promise<File> {
  if (f.type === "application/pdf" || !tipoValido(f)) return f;
  try {
    const bmp = await createImageBitmap(f);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * escala);
    canvas.height = Math.round(bmp.height * escala);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff"; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob) return conTipo(f);
    const nombre = f.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], nombre, { type: "image/jpeg" });
  } catch {
    return conTipo(f);
  }
}

// Algunas HEIC llegan sin tipo; se lo ponemos para que el servidor las acepte.
function conTipo(f: File) {
  return !f.type && esHeic(f) ? new File([f], f.name, { type: "image/heic" }) : f;
}

export function aBase64(f: File): Promise<{ nombre: string; tipo: string; base64: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ nombre: f.name, tipo: f.type, base64: String(r.result).split(",")[1] });
    r.onerror = () => reject(r.error);
    r.readAsDataURL(f);
  });
}

/* ---------- Carta guardada en el navegador (IndexedDB) ---------- */
// localStorage solo guarda texto; los archivos van a IndexedDB.

const DB = "ems-inscripcion";
const STORE = "archivos";
const CLAVE = "carta";

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function operar<T>(modo: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  try {
    const db = await abrir();
    return await new Promise<T>((resolve, reject) => {
      const req = fn(db.transaction(STORE, modo).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null; // modo privado o almacenamiento bloqueado: seguimos sin guardar
  }
}

export const guardarCarta = (f: File) => operar("readwrite", (s) => s.put(f, CLAVE));
export const leerCarta = async () => {
  const f = await operar<File | undefined>("readonly", (s) => s.get(CLAVE));
  return f instanceof File ? f : null;
};
export const borrarCarta = () => operar("readwrite", (s) => s.delete(CLAVE));

/** Pone un archivo dentro de un <input type="file">. */
export function ponerEnInput(input: HTMLInputElement, f: File | null) {
  const dt = new DataTransfer();
  if (f) dt.items.add(f);
  input.files = dt.files;
}

/* ---------- Envío al script de Google ---------- */

export type Respuesta = {
  ok: boolean;
  error?: string;
  codigo?: string;
  campo?: string;
  id?: string;
  linkCarta?: string;
};

export async function enviar(payload: object): Promise<Respuesta> {
  if (!APPS_SCRIPT_URL) throw new Error("Falta configurar APPS_SCRIPT_URL");
  // Sin Content-Type explícito el navegador manda text/plain y
  // evita el preflight CORS, que Apps Script no soporta.
  const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) });
  return res.json();
}
