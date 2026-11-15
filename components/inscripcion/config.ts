// Configuración del formulario de inscripción.
// Todo lo que cambia de un año a otro está acá.

export const CICLO = "2027";

// URL de la Web App de Google Apps Script (ver docs/inscripcion-apps-script.md).
// Se puede sobreescribir con la variable de entorno NEXT_PUBLIC_INSCRIPCION_URL.
export const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_INSCRIPCION_URL ?? "";

export const DOCUMENTOS = {
  matricula:
    "https://docs.google.com/document/d/1gjg82p5aynflq-q9fKs5-6_of7NY4Vpdwc5jFVyf-so/edit?usp=sharing",
  estiloDeVida:
    "https://docs.google.com/document/d/1T66pNubnuI7cyIZX0fsuO6PO6bOP-2cdx_Fh3wHsxFU/edit?usp=sharing",
  reglasYNormas:
    "https://docs.google.com/document/d/1vxeiT2qjujVIodHOtINOpzQRxc3Lvajc4Etzu18pqBc/edit?usp=sharing",
  // TODO: pegar el link de la carta pastoral para descargar.
  cartaPastoral: "",
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
