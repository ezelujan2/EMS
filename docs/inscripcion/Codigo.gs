/**
 * Recibe las inscripciones del formulario de la web de la EMS (/inscripcion).
 *
 * - Agrega una fila por inscripción en la hoja "Inscripciones".
 *   Las columnas se crean solas a partir de los campos del formulario.
 * - Guarda la carta pastoral en una carpeta privada de Drive y pone el link en la fila.
 * - Manda un mail de confirmación al inscripto y un aviso al equipo.
 *
 * Instrucciones de instalación: docs/inscripcion/README.md
 */

const CONFIG = {
  HOJA: "Inscripciones",
  CARPETA: "Inscripciones EMS - Cartas pastorales",
  EMAIL_AVISO: "infoescuelams@gmail.com",
  NOMBRE_REMITENTE: "Escuela de Ministerio Sobrenatural",
  MAX_MB: 10,
};

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const campos = body.campos || {};
    const nombre = String(campos["Nombre y apellido"] || "").trim();
    const mail = String(campos["Mail"] || "").trim();
    if (!nombre || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
      throw new Error("Faltan datos obligatorios");
    }

    const linkCarta = body.archivo ? guardarArchivo(body.archivo, nombre) : "";

    const fila = Object.assign(
      { Fecha: new Date(), Ciclo: body.ciclo || "" },
      campos,
      { "Carta pastoral": linkCarta, Estado: "Pendiente" }
    );

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      guardarFila(fila);
    } finally {
      lock.releaseLock();
    }

    enviarMails(nombre, mail, body.ciclo, linkCarta);
    return responder({ ok: true });
  } catch (err) {
    console.error(err);
    return responder({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

// Para probar que la URL funciona abriéndola en el navegador.
function doGet() {
  return responder({ ok: true, mensaje: "Servicio de inscripción EMS activo" });
}

function guardarFila(fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(CONFIG.HOJA) || ss.insertSheet(CONFIG.HOJA);

  const ultimaCol = hoja.getLastColumn();
  const encabezados = ultimaCol ? hoja.getRange(1, 1, 1, ultimaCol).getValues()[0] : [];

  // Agrega columnas nuevas si el formulario tiene campos nuevos.
  let cambiaron = false;
  Object.keys(fila).forEach(function (k) {
    if (encabezados.indexOf(k) === -1) {
      encabezados.push(k);
      cambiaron = true;
    }
  });
  if (cambiaron) {
    hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }

  hoja.appendRow(
    encabezados.map(function (h) {
      return h in fila ? limpiar(fila[h]) : "";
    })
  );
}

// Evita que un texto como "=IMPORTXML(...)" o "+54 341..." se interprete como fórmula.
function limpiar(v) {
  if (typeof v !== "string") return v;
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function guardarArchivo(archivo, nombre) {
  const tipo = String(archivo.tipo || "");
  if (tipo !== "application/pdf" && tipo.indexOf("image/") !== 0) {
    throw new Error("Tipo de archivo no permitido");
  }
  const bytes = Utilities.base64Decode(archivo.base64);
  if (bytes.length > CONFIG.MAX_MB * 1024 * 1024) {
    throw new Error("El archivo supera los " + CONFIG.MAX_MB + " MB");
  }
  const blob = Utilities.newBlob(bytes, tipo, nombre + " - " + (archivo.nombre || "carta-pastoral"));
  return obtenerCarpeta().createFile(blob).getUrl();
}

function obtenerCarpeta() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("CARPETA_ID");
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (e) {
      // la carpeta se borró: se crea otra
    }
  }
  const carpeta = DriveApp.createFolder(CONFIG.CARPETA);
  props.setProperty("CARPETA_ID", carpeta.getId());
  return carpeta;
}

function enviarMails(nombre, mail, ciclo, linkCarta) {
  const primerNombre = nombre.split(" ")[0];
  try {
    MailApp.sendEmail({
      to: mail,
      replyTo: CONFIG.EMAIL_AVISO,
      name: CONFIG.NOMBRE_REMITENTE,
      subject: "Recibimos tu inscripción a la EMS " + (ciclo || ""),
      htmlBody:
        '<div style="font-family:Arial,sans-serif;max-width:560px;color:#191919">' +
        '<h2 style="color:#94976F">¡Hola ' + escapar(primerNombre) + "!</h2>" +
        "<p>Recibimos tu inscripción a la <b>Escuela de Ministerio Sobrenatural</b>.</p>" +
        "<p>En los próximos días nos vamos a poner en contacto para coordinar una entrevista. " +
        "Tras la entrevista vamos a orar y en el lapso de 15 días te daremos el ingreso en caso " +
        "de ser confirmado por el equipo del año correspondiente.</p>" +
        "<p>Si tenés alguna duda, respondé este mail.</p>" +
        '<p style="color:#666">Equipo EMS</p></div>',
    });
  } catch (e) {
    console.error("No se pudo enviar el mail al inscripto", e);
  }

  try {
    MailApp.sendEmail({
      to: CONFIG.EMAIL_AVISO,
      name: "Web EMS",
      subject: "Nueva inscripción: " + nombre,
      htmlBody:
        "<p><b>" + escapar(nombre) + "</b> (" + escapar(mail) + ") se inscribió.</p>" +
        '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Ver planilla</a>' +
        (linkCarta ? ' · <a href="' + linkCarta + '">Ver carta pastoral</a>' : "") + "</p>",
    });
  } catch (e) {
    console.error("No se pudo enviar el aviso", e);
  }
}

function escapar(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Ejecutar UNA vez a mano desde el editor para dar los permisos (Sheets, Drive y Gmail).
function autorizar() {
  obtenerCarpeta();
  SpreadsheetApp.getActiveSpreadsheet().getName();
  console.log("Mails restantes hoy: " + MailApp.getRemainingDailyQuota());
}
