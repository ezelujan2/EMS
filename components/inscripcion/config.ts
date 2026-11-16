// Configuración del formulario de inscripción.
// Todo lo que cambia de un año a otro está acá.

export const CICLO = "2027";

// Abrir o cerrar las inscripciones: pestaña "Configuración" de la planilla (no se toca acá).

// URL de la Web App de Google Apps Script (ver docs/inscripcion/README.md).
// Se puede sobreescribir con la variable de entorno NEXT_PUBLIC_INSCRIPCION_URL.
export const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_INSCRIPCION_URL ??
  "https://script.google.com/macros/s/AKfycbzHG6BNi6CjKfrFKQkjliuTdB6C_UdxaVgoWU9RwKcQEFkOPJwZbZmmMNXTxiF5KNml/exec";

// Documentos que hay que leer y aceptar. Están en /public/documents: el PDF para descargar
// y una imagen de cada página para verlo dentro de la página (los celulares no muestran PDFs
// incrustados). Si se cambia un PDF, hay que regenerar su imagen (ver docs/inscripcion/README.md).
export type Documento = { titulo: string; pdf: string; imagen: string };
const documento = (titulo: string, archivo: string): Documento => ({
  titulo,
  pdf: `/documents/${archivo}.pdf`,
  imagen: `/documents/${archivo}.webp`,
});

export const DOCUMENTOS = {
  // La matrícula de 3° año tiene otros valores y fechas que la de 1° y 2°.
  matricula: {
    general: documento(`Matrícula ${CICLO} (1° y 2° año)`, "matricula-2027-1-y-2"),
    tercero: documento(`Matrícula ${CICLO} (3° año)`, "matricula-2027-3"),
  },
  estiloDeVida: documento("Estilo de vida del avivador", "estilo-de-vida-avivador-2027"),
  reglasYNormas: documento("Reglas y normas del alumno", "reglas-y-normas-2027"),
  cartaPastoral: "/documents/carta-pastoral-2027.pdf",
};

export const EMAIL_CONTACTO = "infoescuelams@gmail.com";

export const MAX_ARCHIVO_MB = 10;

export const LOCALIDADES = [
  "Rosario",
  "Acebal",
  "Álvarez",
  "Alvear",
  "Arroyo Seco",
  "Capitán Bermúdez",
  "Coronel Domínguez",
  "Empalme Villa Constitución",
  "Fighiera",
  "Fray Luis Beltrán",
  "Funes",
  "General Lagos",
  "Granadero Baigorria",
  "Ibarlucea",
  "Pavón",
  "Pérez",
  "Piñero",
  "Pueblo Andino",
  "Pueblo Esther",
  "Ricardone",
  "San Lorenzo",
  "Soldini",
  "Villa Constitución",
  "Villa Gobernador Gálvez",
  "Zavalla",
  "Otra",
];

export const AÑOS_CURSADO = ["Primer año", "Segundo año", "Tercer año"];

export const COMO_NOS_CONOCISTE = [
  "Instagram",
  "Mi iglesia",
  "Un amigo o familiar",
  "Un alumno o ex alumno de la EMS",
  "Otro",
];

// Dominios contra los que se compara el mail para sugerir correcciones ("gmial.com" → "gmail.com").
export const DOMINIOS_MAIL = [
  "gmail.com",
  "hotmail.com",
  "hotmail.com.ar",
  "outlook.com",
  "outlook.com.ar",
  "yahoo.com",
  "yahoo.com.ar",
  "live.com",
  "live.com.ar",
  "icloud.com",
];
