/**
 * Recibe las inscripciones del formulario de la web de la EMS (/inscripcion).
 *
 * - Agrega una fila por inscripción en la pestaña "Inscripciones".
 *   Las columnas se crean solas a partir de los campos del formulario.
 * - Rechaza una segunda inscripción con el mismo DNI o el mismo mail en el mismo ciclo.
 * - Guarda la carta pastoral en una carpeta privada de Drive y pone el link en la fila.
 *   Si la persona elige subirla después, le manda un link para hacerlo (/inscripcion/carta)
 *   y, si quieren, un recordatorio semanal hasta que la suba.
 * - Manda un mail de confirmación al inscripto y un aviso al equipo.
 * - Pestaña "Configuración": abrir o cerrar las inscripciones sin tocar la web.
 * - Pestaña "Resumen": totales que se actualizan solos.
 * - Menú "EMS" en la planilla para todo lo anterior.
 *
 * Instrucciones de instalación: docs/inscripcion/README.md
 */

const CONFIG = {
  HOJA: "Inscripciones",
  CARPETA: "Inscripciones EMS - Cartas pastorales",
  // A quiénes les llega el aviso de cada inscripción (se pueden poner varios).
  EMAILS_AVISO: ["infoescuelams@gmail.com", "terceroems@gmail.com"],
  // A dónde va la respuesta si el inscripto contesta el mail de confirmación.
  RESPONDER_A: "infoescuelams@gmail.com",
  NOMBRE_REMITENTE: "Escuela de Ministerio Sobrenatural",
  // Dirección de la web, para armar el link de "subir la carta después".
  // Para probar con una vista previa de Netlify, poné acá esa dirección (sin "/" al final).
  SITIO: "https://escuelasobrenaturalems.netlify.app",
  MAX_MB: 10,
  // Recordatorios de carta pendiente: cuántos como máximo por persona,
  // y cuántos días esperar después de la inscripción antes del primero.
  MAX_RECORDATORIOS: 4,
  DIAS_ANTES_DEL_PRIMERO: 3,
};

// Valores de la columna Estado (el equipo los cambia a mano desde la planilla).
const ESTADOS = [
  "Carta pendiente",
  "Inscripción completa",
  "Entrevista coordinada",
  "Aceptado",
  "No aceptado",
];
const ENTREGA = "Carta pastoral - entrega";
const DESPUES = "La subo después";
const HOJA_CONFIG = "Configuración";
const HOJA_RESUMEN = "Resumen";
const MENSAJE_CERRADAS =
  "Las inscripciones para el próximo ciclo todavía no están abiertas. Seguinos en Instagram para enterarte cuándo abren.";

/* ---------- Web ---------- */

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.accion === "carta") return responder(subirCartaDespues(body));
    return responder(inscribir(body));
  } catch (err) {
    console.error(err);
    return responder({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

// La web lo consulta para saber si las inscripciones están abiertas.
// También sirve para probar la URL abriéndola en el navegador.
function doGet() {
  const est = estadoInscripciones();
  return responder({
    ok: true,
    servicio: "Inscripción EMS activa",
    abiertas: est.abiertas,
    mensajeCerradas: est.mensaje,
  });
}

/* ---------- Menú en la planilla ---------- */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("EMS")
    .addItem("Preparar planilla (Configuración y Resumen)", "prepararPlanilla")
    .addItem("Activar recordatorios semanales de carta", "activarRecordatorios")
    .addItem("Desactivar recordatorios semanales", "desactivarRecordatorios")
    .addItem("Enviar recordatorios de carta ahora", "recordarCartas")
    .addToUi();
}

// Ejecutar UNA vez a mano desde el editor para dar los permisos y crear las pestañas.
function autorizar() {
  obtenerCarpeta();
  prepararPlanilla();
  console.log("Mails restantes hoy: " + MailApp.getRemainingDailyQuota());
}

function prepararPlanilla() {
  const hoja = obtenerHoja();
  asegurarColumna(hoja, "Recordatorios");
  asegurarColumna(hoja, "Último recordatorio");
  hojaConfig();
  actualizarResumen();
  avisar("Listo: pestañas Inscripciones, Configuración y Resumen preparadas.");
}

/* ---------- Inscripción ---------- */

function inscribir(body) {
  const est = estadoInscripciones();
  if (!est.abiertas) return { ok: false, codigo: "cerradas", error: est.mensaje };

  const campos = body.campos || {};
  const ciclo = String(body.ciclo || "");
  const nombre = String(campos["Nombre y apellido"] || "").trim();
  const mail = String(campos["Mail"] || "").trim().toLowerCase();
  const dni = soloNumeros(campos["DNI"]);
  if (!nombre || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail) || dni.length < 7) {
    throw new Error("Faltan datos obligatorios");
  }
  campos["DNI"] = dni;
  campos["Mail"] = mail;

  const despues = campos[ENTREGA] === DESPUES;
  delete campos[ENTREGA];
  if (!despues && !body.archivo) throw new Error("Falta la carta pastoral");

  const id = Utilities.getUuid().slice(0, 8).toUpperCase();
  const token = despues ? Utilities.getUuid() : "";

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    // El chequeo de duplicado va dentro del lock para que dos envíos simultáneos no pasen los dos.
    const repetido = buscarDuplicado(dni, mail, ciclo);
    if (repetido) {
      return { ok: false, codigo: "duplicado", campo: repetido, error: "Ya hay una inscripción con ese " + repetido + "." };
    }
    const linkCarta = body.archivo ? guardarArchivo(body.archivo, nombre) : "";
    guardarFila(
      Object.assign(
        {
          Fecha: new Date(),
          ID: id,
          Estado: despues ? "Carta pendiente" : "Inscripción completa",
          Ciclo: ciclo,
        },
        campos,
        { "Carta pastoral": linkCarta, "Token carta": token, Recordatorios: "", "Último recordatorio": "" }
      )
    );
  } finally {
    lock.releaseLock();
  }

  const linkSubir = despues ? linkParaSubir(id, token) : "";
  mailInscripto(nombre, mail, ciclo, linkSubir, campos);
  avisarEquipo("Nueva inscripción: " + nombre, nombre + " (" + mail + ") se inscribió" + (despues ? " y va a subir la carta más tarde." : "."));
  return { ok: true, id: id, linkCarta: linkSubir || undefined };
}

// Devuelve "DNI" o "mail" si ya hay una inscripción con ese dato en el mismo ciclo; si no, "".
function buscarDuplicado(dni, mail, ciclo) {
  const datos = obtenerHoja().getDataRange().getValues();
  if (datos.length < 2) return "";
  const cDni = datos[0].indexOf("DNI");
  const cMail = datos[0].indexOf("Mail");
  const cCiclo = datos[0].indexOf("Ciclo");
  for (let i = 1; i < datos.length; i++) {
    if (cCiclo !== -1 && String(datos[i][cCiclo]) !== ciclo) continue;
    if (cDni !== -1 && soloNumeros(datos[i][cDni]) === dni) return "DNI";
    if (cMail !== -1 && String(datos[i][cMail]).trim().toLowerCase() === mail) return "mail";
  }
  return "";
}

function linkParaSubir(id, token) {
  return CONFIG.SITIO + "/inscripcion/carta?id=" + encodeURIComponent(id) + "&t=" + encodeURIComponent(token);
}

/* ---------- Carta subida después ---------- */

function subirCartaDespues(body) {
  const id = String(body.id || "");
  const token = String(body.token || "");
  if (!id || !token || !body.archivo) return { ok: false, error: "Faltan datos." };

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const hoja = obtenerHoja();
    const datos = hoja.getDataRange().getValues();
    const col = indiceColumnas(datos[0]);
    for (let i = 1; i < datos.length; i++) {
      if (String(datos[i][col["ID"]]) !== id) continue;
      if (String(datos[i][col["Token carta"]]) !== token) break;
      if (datos[i][col["Carta pastoral"]]) {
        return { ok: false, error: "Esta inscripción ya tiene la carta cargada. Si necesitás cambiarla, escribinos." };
      }
      const nombre = String(datos[i][col["Nombre y apellido"]]);
      const link = guardarArchivo(body.archivo, nombre);
      const fila = i + 1;
      hoja.getRange(fila, col["Carta pastoral"] + 1).setValue(link);
      hoja.getRange(fila, col["Token carta"] + 1).setValue(""); // el link deja de servir
      if (datos[i][col["Estado"]] === "Carta pendiente") {
        hoja.getRange(fila, col["Estado"] + 1).setValue("Inscripción completa");
      }
      avisarEquipo("Carta pastoral recibida: " + nombre, nombre + " subió su carta pastoral.", link);
      return { ok: true };
    }
    return { ok: false, error: "El link no es válido o ya se usó. Escribinos a " + CONFIG.RESPONDER_A + "." };
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Recordatorios de carta pendiente ---------- */

// Manda un recordatorio a quien siga en "Carta pendiente".
// Nunca más de uno por semana por persona ni más de CONFIG.MAX_RECORDATORIOS en total,
// y el primero recién CONFIG.DIAS_ANTES_DEL_PRIMERO días después de inscribirse.
function recordarCartas() {
  const hoja = obtenerHoja();
  asegurarColumna(hoja, "Recordatorios");
  asegurarColumna(hoja, "Último recordatorio");
  const datos = hoja.getDataRange().getValues();
  const col = indiceColumnas(datos[0]);
  const ahora = new Date();
  const dia = 24 * 60 * 60 * 1000;
  const seisDias = 6 * dia;
  let enviados = 0;

  for (let i = 1; i < datos.length; i++) {
    const f = datos[i];
    const token = String(f[col["Token carta"]] || "");
    const cantidad = Number(f[col["Recordatorios"]]) || 0;
    const ultimo = f[col["Último recordatorio"]];
    if (f[col["Estado"]] !== "Carta pendiente" || !token) continue;
    if (cantidad >= CONFIG.MAX_RECORDATORIOS) continue;
    if (ultimo instanceof Date && ahora - ultimo < seisDias) continue;
    const inscripcion = f[col["Fecha"]];
    if (inscripcion instanceof Date && ahora - inscripcion < CONFIG.DIAS_ANTES_DEL_PRIMERO * dia) continue;

    const nombre = String(f[col["Nombre y apellido"]]);
    const mail = String(f[col["Mail"]]);
    const link = linkParaSubir(String(f[col["ID"]]), token);
    try {
      MailApp.sendEmail({
        to: mail,
        replyTo: CONFIG.RESPONDER_A,
        name: CONFIG.NOMBRE_REMITENTE,
        subject: "Recordatorio: falta tu carta pastoral para la EMS",
        htmlBody:
          '<div style="font-family:Arial,sans-serif;max-width:560px;color:#191919">' +
          '<h2 style="color:#799DFF">¡Hola ' + escapar(nombre.split(" ")[0]) + "!</h2>" +
          "<p>Te recordamos que para completar tu inscripción a la <b>Escuela de Ministerio Sobrenatural</b> nos falta tu carta pastoral.</p>" +
          bloqueSubirCarta(link) +
          "<p>Si ya la enviaste por otro medio o tenés alguna duda, respondé este mail.</p>" +
          '<p style="color:#666">Equipo EMS</p></div>',
      });
    } catch (e) {
      console.error("No se pudo enviar el recordatorio a " + mail, e);
      break; // probablemente se agotó la cuota diaria: seguimos la próxima vez
    }
    hoja.getRange(i + 1, col["Recordatorios"] + 1).setValue(cantidad + 1);
    hoja.getRange(i + 1, col["Último recordatorio"] + 1).setValue(ahora);
    enviados++;
  }
  avisar(enviados ? "Recordatorios enviados: " + enviados + "." : "No había recordatorios para enviar.");
  return enviados;
}

function activarRecordatorios() {
  desactivarRecordatorios(true);
  ScriptApp.newTrigger("recordarCartas").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();
  avisar("Recordatorios activados: todos los lunes a las 9 a quien tenga la carta pendiente.");
}

function desactivarRecordatorios(silencioso) {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "recordarCartas") ScriptApp.deleteTrigger(t);
  });
  if (silencioso !== true) avisar("Recordatorios desactivados.");
}

/* ---------- Configuración: abrir o cerrar inscripciones ---------- */

function hojaConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(HOJA_CONFIG);
  if (h) return h;
  h = ss.insertSheet(HOJA_CONFIG);
  h.getRange(1, 1, 4, 3).setValues([
    ["Opción", "Valor", "Ayuda"],
    ["Inscripciones abiertas", "SÍ", "Elegí SÍ o NO. Con NO, la web muestra el mensaje de abajo en lugar del formulario."],
    ["Mensaje cuando están cerradas", MENSAJE_CERRADAS, "Lo que ve la gente en la página de inscripción cuando están cerradas."],
    ["Abiertas hasta el (opcional)", "", "Fecha de cierre automático, inclusive (dd/mm/aaaa). Dejala vacía si no querés cierre automático."],
  ]);
  h.getRange(1, 1, 1, 3).setFontWeight("bold");
  h.getRange(2, 2).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["SÍ", "NO"], true).build());
  h.getRange(4, 2).setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build()).setNumberFormat("dd/mm/yyyy");
  h.setColumnWidth(1, 220);
  h.setColumnWidth(2, 380);
  h.setColumnWidth(3, 520);
  return h;
}

function estadoInscripciones() {
  const v = hojaConfig().getRange(2, 2, 3, 1).getValues();
  const prendidas = String(v[0][0]).trim().toUpperCase() !== "NO";
  const mensaje = String(v[1][0] || "").trim() || MENSAJE_CERRADAS;
  let vencidas = false;
  if (v[2][0] instanceof Date) {
    const finDelDia = new Date(v[2][0]);
    finDelDia.setHours(23, 59, 59, 999);
    vencidas = new Date() > finDelDia;
  }
  return { abiertas: prendidas && !vencidas, mensaje: mensaje };
}

/* ---------- Resumen ---------- */

// Arma la pestaña Resumen con fórmulas: se actualiza sola con cada inscripción.
function actualizarResumen() {
  const enc = encabezadosActuales();
  if (!enc.length) return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const r = ss.getSheetByName(HOJA_RESUMEN) || ss.insertSheet(HOJA_RESUMEN);
  r.clear();
  const rango = function (nombre) {
    const i = enc.indexOf(nombre);
    if (i === -1) return "";
    const l = letraColumna(i + 1);
    return "'" + CONFIG.HOJA + "'!" + l + "2:" + l;
  };

  r.getRange(1, 1).setValue("Resumen de inscripciones").setFontWeight("bold").setFontSize(14);
  r.getRange(2, 1).setValue("Se actualiza solo con cada inscripción. No escribas en esta pestaña.");
  r.getRange(4, 1, 2, 1).setValues([["Total de inscriptos"], ["Cartas pendientes"]]).setFontWeight("bold");
  if (rango("ID")) r.getRange(4, 2).setFormula("=COUNTA(" + rango("ID") + ")");
  if (rango("Estado")) r.getRange(5, 2).setFormula('=COUNTIF(' + rango("Estado") + ',"Carta pendiente")');

  // Conteos por categoría, uno al lado del otro para que no se pisen al crecer.
  const bloques = [
    ["Por estado", "Estado"],
    ["Por año de cursado", "Año de cursado"],
    ["¿Cómo conocieron la EMS?", "Cómo conoció la EMS"],
    ["Por localidad", "Localidad"],
  ];
  let columna = 4;
  bloques.forEach(function (b) {
    const rg = rango(b[1]);
    if (!rg) return;
    r.getRange(4, columna).setValue(b[0]).setFontWeight("bold");
    r.getRange(5, columna).setFormula(
      '=IFERROR(QUERY({' + rg + '},"select Col1, count(Col1) where Col1 <> \'\' group by Col1 order by count(Col1) desc label count(Col1) \'\'",0),"Todavía no hay datos")'
    );
    r.setColumnWidth(columna, 220);
    columna += 3;
  });
  r.setColumnWidth(1, 200);
}

/* ---------- Planilla ---------- */

function obtenerHoja() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(CONFIG.HOJA) || ss.insertSheet(CONFIG.HOJA);
}

function encabezadosActuales() {
  const hoja = obtenerHoja();
  const ultimaCol = hoja.getLastColumn();
  return ultimaCol ? hoja.getRange(1, 1, 1, ultimaCol).getValues()[0] : [];
}

function guardarFila(fila) {
  const hoja = obtenerHoja();
  const encabezados = encabezadosActuales();

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
    // Lista desplegable en Estado, para que el equipo marque el avance.
    const cEstado = encabezados.indexOf("Estado") + 1;
    if (cEstado) {
      const regla = SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).build();
      hoja.getRange(2, cEstado, hoja.getMaxRows() - 1, 1).setDataValidation(regla);
    }
  }

  hoja.appendRow(
    encabezados.map(function (h) {
      return h in fila ? limpiar(fila[h]) : "";
    })
  );
  if (cambiaron) actualizarResumen(); // las columnas cambiaron: rearmamos las fórmulas
}

// Agrega una columna al final si falta (solo si la planilla ya tiene títulos).
function asegurarColumna(hoja, nombre) {
  const enc = encabezadosActuales();
  if (!enc.length || enc.indexOf(nombre) !== -1) return;
  hoja.getRange(1, enc.length + 1).setValue(nombre).setFontWeight("bold");
}

function indiceColumnas(encabezados) {
  const col = {};
  encabezados.forEach(function (h, i) {
    col[h] = i;
  });
  return col;
}

// 1 → A, 27 → AA
function letraColumna(n) {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Evita que un texto como "=IMPORTXML(...)" o "+54 341..." se interprete como fórmula.
function limpiar(v) {
  if (typeof v !== "string") return v;
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function soloNumeros(v) {
  return String(v == null ? "" : v).replace(/\D/g, "");
}

// Mensaje chico abajo a la derecha de la planilla (si se ejecuta desde el menú).
function avisar(texto) {
  console.log(texto);
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(texto, "EMS", 6);
  } catch (e) {
    // sin planilla abierta (por ejemplo, desde el recordatorio automático)
  }
}

/* ---------- Drive ---------- */

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

/* ---------- Mails ---------- */
// Si se agota la cuota diaria de mails, la inscripción se guarda igual.

function bloqueSubirCarta(link) {
  return (
    '<div style="border:2px solid #FFC400;border-radius:10px;padding:16px;margin:20px 0">' +
    "<b>Falta tu carta pastoral.</b> Cuando la tengas firmada, subila desde este link:<br><br>" +
    '<a href="' + link + '" style="background:#4568DE;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;display:inline-block">Subir la carta pastoral</a>' +
    "<br><br>La inscripción no se confirma hasta recibirla.</div>"
  );
}

// Tabla con las respuestas, para que la persona tenga una copia de lo que envió.
function tablaRespuestas(campos) {
  const filas = Object.keys(campos)
    .filter(function (k) {
      return campos[k] !== "" && campos[k] != null;
    })
    .map(function (k) {
      return (
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;vertical-align:top;width:40%">' +
        escapar(k) +
        '</td><td style="padding:6px 10px;border-bottom:1px solid #eee;vertical-align:top">' +
        escapar(campos[k]) +
        "</td></tr>"
      );
    })
    .join("");
  return (
    '<h3 style="color:#799DFF;margin-top:28px">Tus respuestas</h3>' +
    '<table style="border-collapse:collapse;width:100%;font-size:14px">' + filas + "</table>" +
    '<p style="color:#666;font-size:13px">Si algún dato está mal, respondé este mail y lo corregimos.</p>'
  );
}

function mailInscripto(nombre, mail, ciclo, linkSubir, campos) {
  try {
    MailApp.sendEmail({
      to: mail,
      replyTo: CONFIG.RESPONDER_A,
      name: CONFIG.NOMBRE_REMITENTE,
      subject: "Recibimos tu inscripción a la EMS " + (ciclo || ""),
      htmlBody:
        '<div style="font-family:Arial,sans-serif;max-width:560px;color:#191919">' +
        '<h2 style="color:#799DFF">¡Hola ' + escapar(nombre.split(" ")[0]) + "!</h2>" +
        "<p>Recibimos tu inscripción a la <b>Escuela de Ministerio Sobrenatural</b>.</p>" +
        (linkSubir ? bloqueSubirCarta(linkSubir) : "") +
        "<p>En los próximos días nos vamos a poner en contacto para coordinar una entrevista. " +
        "Tras la entrevista vamos a orar y en el lapso de 15 días te daremos el ingreso en caso " +
        "de ser confirmado por el equipo del año correspondiente.</p>" +
        "<p>Si tenés alguna duda, respondé este mail.</p>" +
        '<p style="color:#666">Equipo EMS</p>' +
        (campos ? tablaRespuestas(campos) : "") +
        "</div>",
    });
  } catch (e) {
    console.error("No se pudo enviar el mail al inscripto", e);
  }
}

function avisarEquipo(asunto, texto, linkCarta) {
  try {
    MailApp.sendEmail({
      to: CONFIG.EMAILS_AVISO.join(","),
      name: "Web EMS",
      subject: asunto,
      htmlBody:
        "<p>" + escapar(texto) + "</p>" +
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
