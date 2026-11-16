"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  AÑOS_CURSADO,
  CICLO,
  COMO_NOS_CONOCISTE,
  DOCUMENTOS,
  DOMINIOS_MAIL,
  EMAIL_CONTACTO,
  LOCALIDADES,
  MAX_ARCHIVO_MB,
} from "./config";
import {
  aBase64,
  borrarCarta,
  enviar,
  errorArchivo,
  guardarCarta,
  leerCarta,
  ponerEnInput,
  prepararArchivo,
  type Respuesta,
} from "./archivos";
import type { Documento } from "./config";

const PASOS = ["Datos personales", "Inscripción", "Iglesia", "Salud", "Carta pastoral", "Revisión"];
const PASO_CARTA = 4;
const REVISION = PASOS.length - 1;

const HONEYPOT = "_website";
const OTRA = "__otra";
const ENTREGA = "Carta pastoral - entrega";
const DESPUES = "La subo después";
const STORAGE_KEY = "ems-inscripcion-borrador";

type Estado = "editando" | "enviando" | "enviado" | "error";
type Datos = Record<string, string>;
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Seccion = { paso: number; items: [string, string][] };

/* ---------- Contexto: errores y borrador guardado ---------- */

const FormCtx = createContext<{ errores: Datos; borrador: Datos }>({
  errores: {},
  borrador: {},
});
const useError = (k: string) => useContext(FormCtx).errores[k];
const useBorrador = (k: string) => useContext(FormCtx).borrador[k];

/* ---------- Formulario ---------- */

export default function InscripcionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [paso, setPaso] = useState(0);
  const [maxPaso, setMaxPaso] = useState(0);
  const [estado, setEstado] = useState<Estado>("editando");
  const [aviso, setAviso] = useState<{ titulo: string; texto: string } | null>(null);
  const [errores, setErrores] = useState<Datos>({});
  const [borrador, setBorrador] = useState<Datos>({});
  const [restaurado, setRestaurado] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [resumen, setResumen] = useState<Seccion[]>([]);
  const [resultado, setResultado] = useState<Respuesta | null>(null);
  const [anio, setAnio] = useState(""); // año de cursado elegido: define qué matrícula se muestra

  // Recupera lo que la persona ya había completado en este dispositivo.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const g = JSON.parse(raw) as { paso: number; maxPaso?: number; datos: Datos };
      if (g.datos && Object.keys(g.datos).length) {
        // La carta pastoral no se puede guardar: como mucho volvemos a ese paso.
        const p = Math.min(g.paso || 0, PASO_CARTA);
        setBorrador(g.datos);
        setAnio(g.datos["Año de cursado"] ?? "");
        setPaso(p);
        setMaxPaso(Math.min(g.maxPaso ?? p, PASO_CARTA));
        setRestaurado(true);
        setGuardado(true);
      }
    } catch {}
  }, []);

  function leerDatos(): Datos {
    const datos: Datos = {};
    if (!formRef.current) return datos;
    new FormData(formRef.current).forEach((v, k) => {
      if (k !== HONEYPOT && typeof v === "string") datos[k] = v;
    });
    return datos;
  }

  function guardar(p = paso, max = maxPaso) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ paso: p, maxPaso: max, datos: leerDatos() }));
      setGuardado(true);
    } catch {}
  }

  function borrarBorrador() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  function empezarDeCero() {
    if (!confirm("¿Borrar todas las respuestas y empezar de nuevo?")) return;
    borrarBorrador();
    borrarCarta();
    setAnio("");
    setBorrador({});
    setErrores({});
    setPaso(0);
    setMaxPaso(0);
    setRestaurado(false);
    setGuardado(false);
    formRef.current?.reset();
  }

  function irA(n: number) {
    // Para avanzar, el paso actual tiene que estar completo.
    if (n > paso && paso !== REVISION && !pasoValido()) return;
    if (n === REVISION) setResumen(armarResumen());
    const max = Math.max(maxPaso, n);
    setPaso(n);
    setMaxPaso(max);
    setErrores({});
    guardar(n, max);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function controles(n: number): Control[] {
    const fs = formRef.current?.querySelector(`fieldset[data-paso="${n}"]`);
    return fs ? Array.from(fs.querySelectorAll<Control>("input, select, textarea")) : [];
  }

  // Valida un paso. Si `mostrar`, marca los errores y lleva al primero.
  function pasoValido(n = paso, mostrar = true) {
    const nuevos: Datos = {};
    let primero: Control | null = null;
    for (const el of controles(n)) {
      if (!el.name || el.name === HONEYPOT) continue;
      ponerValor(el, normalizar(el)); // por si se tocó "Siguiente" con Enter, sin salir del campo
      const msg = mensajeError(el);
      if (msg && !nuevos[el.name]) {
        nuevos[el.name] = msg;
        primero ??= el;
      }
    }
    if (mostrar) {
      setErrores(nuevos);
      if (primero) {
        primero.scrollIntoView({ block: "center" });
        primero.focus({ preventScroll: true });
      }
    }
    return !primero;
  }

  // Arma el resumen leyendo los campos marcados con data-resumen.
  function armarResumen(): Seccion[] {
    const form = formRef.current;
    if (!form) return [];
    const secciones: Seccion[] = [];
    for (let n = 0; n <= PASO_CARTA; n++) {
      const vistos = new Set<string>();
      const items: [string, string][] = [];
      form
        .querySelectorAll<Control>(`fieldset[data-paso="${n}"] [data-resumen]`)
        .forEach((el) => {
          if (vistos.has(el.name)) return;
          vistos.add(el.name);
          let v = el.value;
          if (el.type === "radio") {
            v = form.querySelector<HTMLInputElement>(`input[name="${CSS.escape(el.name)}"]:checked`)?.value ?? "";
          } else if (el instanceof HTMLInputElement && el.type === "checkbox") {
            v = el.checked ? el.value : "";
          } else if (el instanceof HTMLInputElement && el.type === "file") {
            v = el.files?.[0]?.name ?? "";
          } else if (el instanceof HTMLInputElement && el.type === "date") {
            v = fechaLegible(v);
          }
          if (v === "Otra" || v === "Otro") {
            const otra = form.elements.namedItem(el.name + OTRA) as HTMLInputElement | null;
            v = `${v}: ${otra?.value ?? ""}`;
          }
          items.push([el.dataset.resumen!, v.trim() || "Sin completar"]);
        });
      secciones.push({ paso: n, items });
    }
    return secciones;
  }

  function revalidar(el: Control, mostrarSiempre: boolean) {
    const k = el.name;
    if (!k) return;
    const msg = mensajeError(el);
    setErrores((prev) => {
      if (!mostrarSiempre && !prev[k]) return prev;
      if ((prev[k] ?? "") === msg) return prev;
      const next = { ...prev };
      if (msg) next[k] = msg;
      else delete next[k];
      return next;
    });
  }

  function onChange(e: React.FormEvent<HTMLFormElement>) {
    const el = e.target as unknown as Control;
    if (el.name === "Año de cursado") setAnio(el.value);
    // Radios, checkboxes y selects se validan al elegir; el resto, si ya tenía error.
    const inmediato = ["radio", "checkbox", "file", "select-one"].includes(el.type);
    revalidar(el, inmediato);
    guardar();
  }

  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const el = e.target as unknown as Control;
    if (!("validity" in el) || !el.name) return;
    // Al salir del campo solo marcamos errores de formato, no los vacíos.
    ponerValor(el, normalizar(el));
    if (el.value) revalidar(el, true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    if (paso !== REVISION) return irA(paso + 1);

    // Antes de enviar revisamos todo: puede faltar algo si se recuperó un borrador.
    for (let n = 0; n <= PASO_CARTA; n++) {
      if (!pasoValido(n, false)) {
        setPaso(n);
        setTimeout(() => pasoValido(n), 50);
        return;
      }
    }

    const data = new FormData(e.currentTarget);
    if (data.get(HONEYPOT)) {
      setEstado("enviado"); // bot: fingimos éxito
      return;
    }

    setEstado("enviando");
    setAviso(null);

    try {
      const campos: Datos = {};
      let archivo: File | null = null;
      data.forEach((valor, k) => {
        if (k === HONEYPOT) return;
        if (valor instanceof File) {
          if (valor.size > 0) archivo = valor;
        } else {
          campos[k] = valor.trim();
        }
      });
      for (const k of Object.keys(campos)) {
        // "Otra"/"Otro": junta la opción elegida con el texto escrito.
        if (k.endsWith(OTRA)) {
          const base = k.slice(0, -OTRA.length);
          if (campos[base] === "Otra" || campos[base] === "Otro") campos[base] = `${campos[base]}: ${campos[k]}`;
          delete campos[k];
        }
        // Auxiliares de las preguntas Sí/No (ya combinados en el campo principal).
        if (k.endsWith("__op") || k.endsWith("__detalle")) delete campos[k];
      }

      campos["DNI"] = (campos["DNI"] ?? "").replace(/\D/g, "");
      campos["Fecha de nacimiento"] = fechaLegible(campos["Fecha de nacimiento"] ?? "");

      const json = await enviar({
        accion: "inscripcion",
        ciclo: CICLO,
        campos,
        archivo: archivo ? await aBase64(archivo) : null,
      });

      if (!json.ok) {
        if (json.codigo === "cerradas") {
          setAviso({ titulo: "Las inscripciones están cerradas", texto: json.error || "" });
          setEstado("error");
          return;
        }
        if (json.codigo === "duplicado") {
          const dato = json.campo === "mail" ? `el mail ${campos["Mail"]}` : `el DNI ${campos["DNI"]}`;
          setAviso({
            titulo: "Ya hay una inscripción con estos datos",
            texto: `Ya existe una inscripción para el ciclo ${CICLO} con ${dato}. No hace falta que te inscribas de nuevo. Si necesitás corregir algún dato, escribinos a ${EMAIL_CONTACTO}.`,
          });
          setEstado("error");
          return;
        }
        throw new Error(json.error || "Error desconocido");
      }

      borrarBorrador();
      borrarCarta();
      setResultado(json);
      setEstado("enviado");
      topRef.current?.scrollIntoView({ block: "start" });
    } catch (err) {
      console.error(err);
      setAviso({
        titulo: "No se pudo enviar la inscripción",
        texto: `Tus respuestas quedaron guardadas en este dispositivo. Revisá tu conexión e intentá de nuevo en unos minutos. Si sigue sin funcionar, escribinos a ${EMAIL_CONTACTO}.`,
      });
      setEstado("error");
    }
  }

  if (estado === "enviado") {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <Exito linkCarta={resultado?.linkCarta} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28 font-articulat">
      <Progreso paso={paso} maxPaso={maxPaso} guardado={guardado} onIr={irA} />

      {restaurado && (
        <p className="mt-4 text-sm text-gray-600">
          Seguís desde donde lo dejaste.{" "}
          <button type="button" onClick={empezarDeCero} className="font-medium text-ems-blue underline underline-offset-2">
            Empezar de nuevo
          </button>
        </p>
      )}

      <FormCtx.Provider value={{ errores, borrador }}>
        <form
          key={restaurado ? "borrador" : "nuevo"}
          ref={formRef}
          onSubmit={onSubmit}
          onChange={onChange}
          onBlur={onBlur}
          noValidate
          className="mt-6 rounded-[10px] border border-gray-200 bg-white px-5 pt-8 sm:px-10 sm:pt-10 shadow-sm"
        >
          {/* Honeypot anti-spam: invisible para personas */}
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          <Paso n={0} actual={paso} titulo="Datos personales">
            <Texto
              name="Nombre y apellido"
              autoComplete="name"
              pattern="\S+(\s+\S+)+"
              mensaje="Escribí tu nombre y tu apellido."
            />
            <Texto
              name="DNI"
              inputMode="numeric"
              ayuda="Solo números, sin puntos."
              pattern="\d{7,8}"
              mensaje="Ingresá un DNI válido (7 u 8 números)."
            />
            <FechaNacimiento />
            <Mail />
            <Texto
              name="Teléfono"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              ayuda="Con característica, por ejemplo 341 555-1234."
              pattern="[\d\s()+\-]{8,}"
              mensaje="Ingresá un teléfono válido, con característica."
            />
            <Texto name="Domicilio" autoComplete="street-address" />
            <Localidad name="Localidad" />
            <Texto
              name="Último estudio realizado"
              label="¿Cuál fue el último estudio que realizaste?"
              ayuda="Primario, secundario o carrera de cualquier tipo. Indicá hasta qué año completaste."
            />
          </Paso>

          <Paso n={1} actual={paso} titulo="Inscripción" descripcion={`Ciclo lectivo ${CICLO}.`}>
            <Opciones name="Año de cursado" label="¿A qué año te inscribís?" opciones={AÑOS_CURSADO} />
            <Opciones
              name="Cómo conoció la EMS"
              label="¿Cómo conociste la EMS?"
              opciones={COMO_NOS_CONOCISTE}
              columnas={2}
            />
            <div className="space-y-3">
              <Etiqueta>Documentos</Etiqueta>
              <p className="text-sm text-gray-500 -mt-1">Abrí y leé cada documento para poder aceptarlo.</p>
              {anio ? (
                // key: si cambia el año, la matrícula es otra y hay que volver a aceptarla.
                <Acepto
                  key={anio === "Tercer año" ? "m3" : "m12"}
                  name="Matrícula"
                  documento={anio === "Tercer año" ? DOCUMENTOS.matricula.tercero : DOCUMENTOS.matricula.general}
                />
              ) : (
                <p className="rounded-[10px] border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                  La matrícula depende del año: elegí arriba a qué año te inscribís para verla.
                </p>
              )}
              <Acepto name="Estilo de vida del avivador" documento={DOCUMENTOS.estiloDeVida} />
              <Acepto name="Reglas y normas del alumno" documento={DOCUMENTOS.reglasYNormas} />
            </div>
          </Paso>

          <Paso n={2} actual={paso} titulo="Iglesia a la que asistís">
            <Texto name="Iglesia - Nombre" label="Nombre de la iglesia" />
            <Texto name="Iglesia - Denominación" label="Denominación" />
            <Texto
              name="Iglesia - Pastor"
              label="Nombre y apellido del pastor"
              pattern="\S+(\s+\S+)+"
              mensaje="Escribí nombre y apellido del pastor."
            />
            <Texto name="Iglesia - Domicilio" label="Domicilio de la iglesia" />
            <Localidad name="Iglesia - Localidad" label="Localidad de la iglesia" />
            <Area
              name="Asistencia habitual"
              label="¿Asistís de forma habitual?"
              ayuda="Además de los domingos, ¿participás de la vida de la iglesia de alguna otra forma, como grupos pequeños (barcas, racimos, células, etc.)?"
            />
            <Area
              name="Área de servicio"
              label="¿Estás involucrado/a en algún área de servicio en tu congregación?"
            />
          </Paso>

          <Paso n={3} actual={paso} titulo="Informe de salud" descripcion="Esta información es confidencial y solo la usamos para cuidarte.">
            <SiNo name="Alergias" label="¿Tenés alergias?" />
            <SiNo name="Tratamiento permanente" label="¿Recibís algún tratamiento permanente?" />
            <SiNo name="Problemas de salud" label="¿Tenés algún problema de salud?" />
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg">Contacto en caso de emergencia</h3>
              <p className="text-sm text-gray-500">Una persona a quien podamos llamar si te pasa algo.</p>
            </div>
            <Texto name="Emergencia - Nombre" label="Nombre y apellido" />
            <Texto
              name="Emergencia - Teléfono"
              label="Teléfono"
              type="tel"
              inputMode="tel"
              pattern="[\d\s()+\-]{8,}"
              mensaje="Ingresá un teléfono válido, con característica."
            />
            <Casilla name="Consentimiento datos de salud" resumen="Consentimiento de datos de salud">
              Autorizo a la EMS a usar mi información de salud únicamente para cuidarme durante el
              cursado y las actividades de la escuela.
            </Casilla>
          </Paso>

          <Paso n={PASO_CARTA} actual={paso} titulo="Recomendación pastoral">
            <ol className="space-y-2 text-gray-700">
              {[
                "Descargá la carta pastoral.",
                "Pedile a tu pastor que la complete y la firme.",
                "Subila acá en PDF o como foto, o elegí subirla más tarde.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ems-blue/15 text-sm font-bold text-ems-blue">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            {DOCUMENTOS.cartaPastoral && (
              <a
                href={DOCUMENTOS.cartaPastoral}
                download="Carta pastoral EMS 2027.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-ems-blue underline underline-offset-4"
              >
                Descargar carta pastoral
              </a>
            )}
            <Archivo />
          </Paso>

          <Paso n={REVISION} actual={paso} titulo="Revisá tus datos" descripcion="Si algo está mal, tocá “Editar” para corregirlo.">
            {resumen.map((s) => (
              <div key={s.paso} className="rounded-[10px] border border-gray-200">
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
                  <h3 className="font-bold text-gray-900">{PASOS[s.paso]}</h3>
                  <button
                    type="button"
                    onClick={() => irA(s.paso)}
                    className="text-sm font-medium text-ems-blue underline underline-offset-2"
                  >
                    Editar
                  </button>
                </div>
                <dl className="divide-y divide-gray-100 px-4">
                  {s.items.map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-2.5 sm:grid-cols-[2fr_3fr] sm:gap-4">
                      <dt className="text-sm text-gray-500">{k}</dt>
                      <dd className={`text-sm break-words ${v === "Sin completar" ? "text-red-600" : "text-gray-900"}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                Al enviar el formulario, entiendo y adhiero a que en las clases tendré que
                participar de todas las actividades y tareas que se planteen a lo largo del año
                para poder seguir adelante y así completar satisfactoriamente el año.
              </p>
              <p>
                Tras entregar este formulario nos pondremos en contacto para coordinar una
                entrevista. Después de la entrevista vamos a orar y en el lapso de 15 días te
                daremos el ingreso en caso de ser confirmado por el equipo del año correspondiente.
              </p>
            </div>
          </Paso>

          {aviso && (
            <p className="mt-8 rounded-[10px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {aviso.texto}
            </p>
          )}
          <Aviso aviso={aviso} />

          {/* En celular la barra queda fija abajo para no tener que buscar el botón. */}
          <div className="sticky bottom-0 -mx-5 sm:-mx-10 mt-10 flex items-center justify-between gap-3 rounded-b-[10px] border-t border-gray-200 bg-white/95 px-5 sm:px-10 py-4 backdrop-blur sm:static sm:bg-white">
            {paso > 0 ? (
              <button
                type="button"
                onClick={() => irA(paso - 1)}
                className="h-12 px-5 rounded-[10px] border-2 border-ems-blue font-medium text-ems-blue transition-colors duration-300 hover:bg-ems-blue/10"
              >
                Anterior
              </button>
            ) : (
              <span className="text-sm text-gray-500">
                <span className="text-red-600">*</span> Obligatorio
              </span>
            )}
            <button
              type="submit"
              disabled={estado === "enviando"}
              className={`h-12 px-6 rounded-[10px] font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait ${
                paso === REVISION
                  ? "bg-ems-sun text-gray-900 hover:bg-[#F0B400]"
                  : "bg-ems-blueStrong text-white hover:bg-[#3A5BCC]"
              }`}
            >
              {estado === "enviando"
                ? "Enviando..."
                : paso === REVISION
                ? "Enviar inscripción"
                : paso === REVISION - 1
                ? "Revisar"
                : "Siguiente"}
            </button>
          </div>
        </form>
      </FormCtx.Provider>
    </div>
  );
}

/* ---------- Estructura ---------- */

function Progreso({
  paso,
  maxPaso,
  guardado,
  onIr,
}: {
  paso: number;
  maxPaso: number;
  guardado: boolean;
  onIr: (n: number) => void;
}) {
  return (
    <nav aria-label="Pasos del formulario">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-gray-700">
          Paso {paso + 1} de {PASOS.length}: <b className="text-gray-900">{PASOS[paso]}</b>
        </span>
        {guardado && <span className="shrink-0 text-gray-500">Borrador guardado</span>}
      </div>
      <ol className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${PASOS.length}, 1fr)` }}>
        {PASOS.map((nombre, i) => {
          const disponible = i <= maxPaso && i !== paso;
          return (
            <li key={nombre}>
              <button
                type="button"
                disabled={!disponible}
                onClick={() => onIr(i)}
                aria-current={i === paso ? "step" : undefined}
                aria-label={`Ir al paso ${i + 1}: ${nombre}`}
                className="group block w-full text-left disabled:cursor-default"
              >
                <span
                  className={`block h-1.5 rounded-full transition-colors ${
                    i <= paso ? "bg-ems-blue" : i <= maxPaso ? "bg-ems-blue/40" : "bg-gray-200"
                  } ${disponible ? "group-hover:bg-ems-blue/70" : ""}`}
                />
                <span
                  className={`mt-2 hidden md:block text-xs ${
                    i === paso ? "font-bold text-gray-900" : disponible ? "text-gray-600 group-hover:text-ems-blue" : "text-gray-400"
                  }`}
                >
                  {nombre}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Paso({
  n,
  actual,
  titulo,
  descripcion,
  children,
}: {
  n: number;
  actual: number;
  titulo: string;
  descripcion?: string;
  children: ReactNode;
}) {
  return (
    <fieldset data-paso={n} hidden={n !== actual}>
      <legend className="mb-8">
        <span className="block text-2xl md:text-3xl font-bold text-ems-blue">{titulo}</span>
        {descripcion && <span className="block mt-1 text-gray-600">{descripcion}</span>}
      </legend>
      <div className="space-y-7">{children}</div>
    </fieldset>
  );
}

/* ---------- Campos ---------- */

const inputCls = (error?: string) =>
  `block w-full h-12 rounded-[10px] bg-white px-4 text-base text-gray-900 focus:ring-1 ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-ems-blue focus:ring-ems-blue"
  }`;

const opcionCls =
  "flex items-center gap-3 rounded-[10px] border border-gray-300 px-4 py-3 cursor-pointer text-gray-800 transition-colors hover:border-ems-blue/60 has-[:checked]:border-ems-blue has-[:checked]:bg-ems-blue/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ems-blue/40";

const radioCls = "h-5 w-5 border-gray-400 text-ems-blue focus:ring-ems-blue";

function Etiqueta({ htmlFor, id, children }: { htmlFor?: string; id?: string; children: ReactNode }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} id={id} className="block font-medium text-gray-900 mb-1.5">
      {children} <span className="text-red-600">*</span>
    </Tag>
  );
}

function Ayuda({ children }: { children?: ReactNode }) {
  return children ? <p className="text-sm text-gray-500 -mt-0.5 mb-2">{children}</p> : null;
}

function MensajeError({ id, error }: { id?: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {error}
    </p>
  );
}

type TextoProps = {
  name: string;
  label?: string;
  ayuda?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  mensaje?: string;
  min?: string;
  max?: string;
};

function Texto({ name, label, ayuda, type = "text", mensaje, ...rest }: TextoProps) {
  const id = slug(name);
  const error = useError(name);
  return (
    <div>
      <Etiqueta htmlFor={id}>{label ?? name}</Etiqueta>
      <Ayuda>{ayuda}</Ayuda>
      <input
        id={id}
        name={name}
        type={type}
        required
        defaultValue={useBorrador(name)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        data-msg={mensaje}
        data-resumen={label ?? name}
        className={inputCls(error)}
        {...rest}
      />
      <MensajeError id={`${id}-error`} error={error} />
    </div>
  );
}

// Fecha de nacimiento siempre como dd/mm/aaaa (el campo de fecha del navegador
// cambia de formato según el idioma del celular).
function FechaNacimiento() {
  const name = "Fecha de nacimiento";
  const id = slug(name);
  const error = useError(name);
  const guardada = useBorrador(name);

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const borrando = (e.nativeEvent as InputEvent).inputType?.startsWith("delete");
    if (!borrando) el.value = formatearFecha(el.value);
    el.setCustomValidity(el.value.length === 10 ? errorFecha(el.value) : "");
  }

  return (
    <div>
      <Etiqueta htmlFor={id}>Fecha de nacimiento</Etiqueta>
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="bday"
        placeholder="dd/mm/aaaa"
        maxLength={10}
        required
        pattern="\d{2}/\d{2}/\d{4}"
        data-msg="Escribí la fecha como dd/mm/aaaa, por ejemplo 25/03/2000."
        defaultValue={guardada ? fechaLegible(guardada) : undefined}
        onInput={onInput}
        onBlur={(e) => e.currentTarget.setCustomValidity(errorFecha(e.currentTarget.value))}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        data-resumen="Fecha de nacimiento"
        className={inputCls(error)}
      />
      <MensajeError id={`${id}-error`} error={error} />
    </div>
  );
}

function Area({ name, label, ayuda }: { name: string; label: string; ayuda?: string }) {
  const id = slug(name);
  const error = useError(name);
  return (
    <div>
      <Etiqueta htmlFor={id}>{label}</Etiqueta>
      <Ayuda>{ayuda}</Ayuda>
      <textarea
        id={id}
        name={name}
        required
        rows={3}
        defaultValue={useBorrador(name)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        data-resumen={label}
        className={`${inputCls(error)} h-auto py-3`}
      />
      <MensajeError id={`${id}-error`} error={error} />
    </div>
  );
}

function Localidad({ name, label }: { name: string; label?: string }) {
  const guardada = useBorrador(name);
  const [otra, setOtra] = useState(guardada === "Otra");
  const id = slug(name);
  const error = useError(name);
  const errorOtra = useError(name + OTRA);
  return (
    <div>
      <Etiqueta htmlFor={id}>{label ?? name}</Etiqueta>
      <select
        id={id}
        name={name}
        required
        defaultValue={guardada ?? ""}
        onChange={(e) => setOtra(e.target.value === "Otra")}
        aria-invalid={!!error}
        data-resumen={label ?? name}
        className={`${inputCls(error)} pr-10`}
      >
        <option value="" disabled>
          Elegí una opción
        </option>
        {LOCALIDADES.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      {otra && (
        <input
          name={name + OTRA}
          required
          placeholder="Escribí la localidad"
          defaultValue={useBorrador(name + OTRA)}
          aria-label={`${label ?? name}: otra`}
          aria-invalid={!!errorOtra}
          className={`${inputCls(errorOtra)} mt-2`}
          autoFocus={!guardada}
        />
      )}
      <MensajeError error={error ?? errorOtra} />
    </div>
  );
}

function Opciones({
  name,
  label,
  opciones,
  columnas = 3,
}: {
  name: string;
  label: string;
  opciones: string[];
  columnas?: 2 | 3;
}) {
  const error = useError(name);
  const errorOtro = useError(name + OTRA);
  const guardado = useBorrador(name);
  const [otro, setOtro] = useState(guardado === "Otro");
  const id = slug(name);
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`}>
      <Etiqueta id={`${id}-label`}>{label}</Etiqueta>
      <div className={`grid gap-2 ${columnas === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {opciones.map((op) => (
          <label key={op} className={`${opcionCls} ${error ? "border-red-400" : ""}`}>
            <input
              type="radio"
              name={name}
              value={op}
              required
              defaultChecked={guardado === op}
              data-resumen={label}
              onChange={() => setOtro(op === "Otro")}
              className={radioCls}
            />
            {op}
          </label>
        ))}
      </div>
      {otro && (
        <input
          name={name + OTRA}
          required
          placeholder="Contanos cuál"
          defaultValue={useBorrador(name + OTRA)}
          aria-label={`${label}: otro`}
          aria-invalid={!!errorOtro}
          className={`${inputCls(errorOtro)} mt-2`}
          autoFocus={guardado !== "Otro"}
        />
      )}
      <MensajeError error={error ?? errorOtro} />
    </div>
  );
}

// Casilla simple (sin documento para leer).
function Casilla({ name, resumen, children }: { name: string; resumen: string; children: ReactNode }) {
  const error = useError(name);
  return (
    <div>
      <label className={`${opcionCls} items-start ${error ? "border-red-400" : ""}`}>
        <input
          type="checkbox"
          name={name}
          value="Autorizado"
          required
          data-msg="Tenés que dar tu autorización para continuar."
          defaultChecked={!!useBorrador(name)}
          data-resumen={resumen}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-400 text-ems-blue focus:ring-ems-blue"
        />
        <span>
          {children} <span className="text-red-600">*</span>
        </span>
      </label>
      <MensajeError error={error} />
    </div>
  );
}

// Mail con sugerencia si el dominio parece mal escrito ("gmial.com" → "gmail.com").
function Mail() {
  const name = "Mail";
  const id = slug(name);
  const error = useError(name);
  const ref = useRef<HTMLInputElement>(null);
  const [sugerencia, setSugerencia] = useState("");

  function revisar() {
    setSugerencia(sugerirMail(ref.current?.value ?? ""));
  }

  function aplicar() {
    const el = ref.current;
    if (!el) return;
    ponerValor(el, sugerencia);
    setSugerencia("");
  }

  return (
    <div>
      <Etiqueta htmlFor={id}>Mail</Etiqueta>
      <Ayuda>Preferentemente una cuenta de Gmail. Te vamos a escribir a esta dirección.</Ayuda>
      <input
        ref={ref}
        id={id}
        name={name}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        defaultValue={useBorrador(name)}
        onBlur={revisar}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        data-resumen="Mail"
        className={inputCls(error)}
      />
      {sugerencia && (
        <p className="mt-1.5 text-sm text-gray-700">
          ¿Quisiste decir{" "}
          <button type="button" onClick={aplicar} className="font-medium text-ems-blue underline underline-offset-2">
            {sugerencia}
          </button>
          ?
        </p>
      )}
      <MensajeError id={`${id}-error`} error={error} />
    </div>
  );
}

// La casilla solo se puede marcar después de abrir el documento.
// El documento se muestra dentro de la página y se acepta desde ahí.
function Acepto({ name, documento }: { name: string; documento: Documento }) {
  const doc = documento.titulo;
  const valor = `Leído y aceptado: ${doc}`;
  const error = useError(name);
  const yaAceptado = useBorrador(name) === valor;
  // "visto": el documento se mostró completo (o, si no cargó, se abrió el PDF).
  const [abierto, setAbierto] = useState(yaAceptado);
  const [carga, setCarga] = useState<"cargando" | "lista" | "error">("cargando");
  const [pdfAbierto, setPdfAbierto] = useState(false);
  const [aviso, setAviso] = useState(false);
  const checkRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Mientras el documento carga no se puede aceptar ni cerrar.
  const puedeAceptar = carga === "lista" || (carga === "error" && pdfAbierto);
  const puedeCerrar = carga !== "cargando";
  const limite = useRef<ReturnType<typeof setTimeout>>(undefined);

  function abrir() {
    setAviso(false);
    dialogRef.current?.showModal();
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth) return documentoListo(); // ya estaba en caché
    // Si en 15 segundos no cargó, lo tratamos como error para que nadie quede trabado.
    clearTimeout(limite.current);
    limite.current = setTimeout(() => setCarga((c) => (c === "cargando" ? "error" : c)), 15000);
  }

  function documentoListo() {
    clearTimeout(limite.current);
    setCarga("lista");
    setAbierto(true);
  }

  function abrirPdf() {
    setPdfAbierto(true);
    if (carga === "error") setAbierto(true);
  }

  function aceptar() {
    // Un clic real dispara los eventos del formulario (guarda borrador y limpia el error).
    const cb = checkRef.current;
    if (cb && !cb.checked) cb.click();
    dialogRef.current?.close();
  }

  return (
    <div>
      <div
        className={`flex flex-wrap items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors has-[:checked]:border-ems-blue has-[:checked]:bg-ems-blue/5 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      >
        <label className={`flex flex-1 min-w-[12rem] items-center gap-3 ${abierto ? "cursor-pointer" : ""}`}>
          <input
            ref={checkRef}
            type="checkbox"
            name={name}
            value={valor}
            required
            defaultChecked={yaAceptado}
            data-resumen={doc}
            onClick={(e) => {
              if (!abierto) {
                e.preventDefault();
                setAviso(true);
              }
            }}
            className="h-5 w-5 rounded border-gray-400 text-ems-blue focus:ring-ems-blue"
          />
          <span className={abierto ? "text-gray-900" : "text-gray-500"}>
            Acepto <b className="font-medium">{doc}</b>
          </span>
        </label>
        <button
          type="button"
          onClick={abrir}
          className="h-10 px-4 rounded-[10px] border-2 border-ems-blue text-sm font-medium text-ems-blue transition-colors duration-300 hover:bg-ems-blue/10"
        >
          {abierto ? "Volver a leer" : "Leer"}
        </button>
      </div>
      {aviso && !error && (
        <p className="mt-1.5 text-sm text-gray-600">Primero abrí el documento con el botón &quot;Leer&quot;.</p>
      )}
      <MensajeError error={error && (abierto ? error : "Abrí y leé el documento para poder aceptarlo.")} />

      <dialog
        ref={dialogRef}
        aria-label={doc}
        className="w-full max-w-3xl h-[90vh] p-0 rounded-[10px] backdrop:bg-black/50"
        onClick={(e) => puedeCerrar && e.target === dialogRef.current && dialogRef.current?.close()}
        // Esc o tocar afuera (Chrome cierra los diálogos así): bloqueado mientras carga.
        onCancel={(e) => !puedeCerrar && e.preventDefault()}
      >
        <div className="flex h-full flex-col font-articulat">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
            <span className="font-bold text-gray-900">{doc}</span>
            <a
              href={documento.pdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={abrirPdf}
              className="shrink-0 text-sm text-gray-600 underline"
            >
              Descargar PDF
            </a>
          </div>
          <div className="relative flex-1 overflow-y-auto bg-gray-100 p-2 sm:p-4">
            {carga === "cargando" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600" role="status">
                <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-ems-blue/30 border-t-ems-blue" />
                Cargando el documento...
              </div>
            )}
            {carga === "error" ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center text-gray-700">
                <p>No se pudo mostrar el documento acá. Abrilo en PDF para leerlo y después volvé para aceptarlo.</p>
                <a
                  href={documento.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={abrirPdf}
                  className="inline-flex h-11 items-center rounded-[10px] border-2 border-ems-blue px-5 font-medium text-ems-blue hover:bg-ems-blue/10"
                >
                  Abrir el PDF
                </a>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={documento.imagen}
                alt={doc}
                loading="lazy"
                onLoad={documentoListo}
                onError={() => {
                  clearTimeout(limite.current);
                  setCarga("error");
                }}
                className={`mx-auto w-full max-w-2xl bg-white shadow-sm transition-opacity ${
                  carga === "lista" ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              disabled={!puedeCerrar}
              className="h-11 px-4 rounded-[10px] border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={aceptar}
              disabled={!puedeAceptar}
              className="h-11 px-5 rounded-[10px] bg-ems-blueStrong font-semibold text-white transition-colors duration-300 hover:bg-[#3A5BCC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Leí y acepto
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

// Pregunta Sí/No que pide detalle si la respuesta es Sí.
// Se guarda como "No" o "Sí: <detalle>".
function SiNo({ name, label }: { name: string; label: string }) {
  const guardado = useBorrador(name);
  const [si, setSi] = useState(guardado?.startsWith("Sí") ?? false);
  const [respondido, setRespondido] = useState(!!guardado);
  const [detalle, setDetalle] = useState(guardado?.replace(/^Sí:?\s*/, "") ?? "");
  const id = slug(name);
  const errorOp = useError(name + "__op");
  const errorDetalle = useError(name + "__detalle");
  const valor = !respondido ? "" : si ? `Sí: ${detalle.trim()}` : "No";

  return (
    <div>
      <Etiqueta id={`${id}-label`}>{label}</Etiqueta>
      <div className="grid grid-cols-2 gap-2 max-w-xs" role="radiogroup" aria-labelledby={`${id}-label`}>
        {["No", "Sí"].map((op) => (
          <label key={op} className={`${opcionCls} ${errorOp ? "border-red-400" : ""}`}>
            <input
              type="radio"
              name={`${name}__op`}
              value={op}
              required
              defaultChecked={respondido && (op === "Sí") === si}
              onChange={() => {
                setRespondido(true);
                setSi(op === "Sí");
              }}
              className={radioCls}
            />
            {op}
          </label>
        ))}
      </div>
      {si && (
        <input
          id={id}
          name={`${name}__detalle`}
          required
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="¿Cuál?"
          aria-label={`${label} ¿Cuál?`}
          className={`${inputCls(errorDetalle)} mt-3`}
          autoFocus={!guardado}
        />
      )}
      <input type="hidden" name={name} value={valor} data-resumen={label} readOnly />
      <MensajeError error={errorOp ?? errorDetalle} />
    </div>
  );
}

// Carta pastoral: se sube ahora o se elige subirla después (llega un link por mail).
function Archivo() {
  const name = "Carta pastoral";
  const guardada = useBorrador(ENTREGA);
  const [modo, setModo] = useState(guardada ?? "");
  const [archivo, setArchivo] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listos = useRef(new WeakSet<File>());
  const errorModo = useError(ENTREGA);
  const error = useError(name);

  // Si la persona ya había elegido la carta, la recuperamos del navegador.
  useEffect(() => {
    if (modo !== "Ahora") return;
    let cancelado = false;
    leerCarta().then((f) => {
      const input = inputRef.current;
      if (cancelado || !f || !input || input.files?.length) return;
      listos.current.add(f);
      ponerEnInput(input, f);
      setArchivo(f.name);
    });
    return () => {
      cancelado = true;
    };
  }, [modo]);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setArrastrando(false);
    const input = e.target;
    const f = input.files?.[0];
    if (!f) {
      setArchivo(null);
      borrarCarta();
      return;
    }
    if (listos.current.has(f)) return; // es el aviso que disparamos abajo
    input.setCustomValidity("");
    setProcesando(true);
    const listo = await prepararArchivo(f);
    setProcesando(false);
    listos.current.add(listo);
    ponerEnInput(input, listo);
    const msg = errorArchivo(listo);
    input.setCustomValidity(msg);
    setArchivo(msg ? null : listo.name);
    if (!msg) guardarCarta(listo);
    // Avisamos al formulario para que valide y guarde el borrador con el archivo final.
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-labelledby="entrega-label">
        <Etiqueta id="entrega-label">¿Cuándo vas a subir la carta?</Etiqueta>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["Ahora", "Ahora, ya la tengo firmada"],
            [DESPUES, "Más tarde, todavía no la tengo"],
          ].map(([valor, texto]) => (
            <label key={valor} className={`${opcionCls} ${errorModo ? "border-red-400" : ""}`}>
              <input
                type="radio"
                name={ENTREGA}
                value={valor}
                required
                defaultChecked={guardada === valor}
                onChange={() => setModo(valor)}
                data-resumen="Entrega de la carta"
                className={radioCls}
              />
              {texto}
            </label>
          ))}
        </div>
        <MensajeError error={errorModo} />
      </div>

      {modo === "Ahora" && (
        <div>
          <Etiqueta htmlFor="carta-pastoral">Carta pastoral firmada</Etiqueta>
          {/* El input cubre todo el recuadro, así se puede tocar o arrastrar el archivo encima. */}
          <div
            onDragEnter={() => setArrastrando(true)}
            onDragLeave={() => setArrastrando(false)}
            className={`relative flex flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ems-blue/40 ${
              arrastrando
                ? "border-ems-blue bg-ems-blue/10"
                : archivo
                ? "border-ems-blue bg-ems-blue/5"
                : error
                ? "border-red-400 bg-red-50"
                : "border-gray-300 hover:border-ems-blue/60"
            }`}
          >
            {procesando ? (
              <span className="font-medium text-gray-700">Preparando el archivo...</span>
            ) : archivo ? (
              <>
                <span className="font-medium text-gray-900 break-all">{archivo}</span>
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
              ref={inputRef}
              id="carta-pastoral"
              type="file"
              name={name}
              accept="application/pdf,image/*,.heic,.heif"
              required
              onChange={onChange}
              data-resumen="Carta pastoral"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <MensajeError error={error} />
          <p className="mt-2 text-sm text-gray-500">
            Si tenés problemas para adjuntarla, enviala a{" "}
            <a href={`mailto:${EMAIL_CONTACTO}`} className="underline">
              {EMAIL_CONTACTO}
            </a>
            .
          </p>
        </div>
      )}

      {modo === DESPUES && (
        <p className="rounded-[10px] bg-ems-blue/10 px-4 py-3 text-gray-800">
          Podés enviar la inscripción igual. Te vamos a mandar un mail con un link para subir la
          carta cuando la tengas. <b className="font-medium">La inscripción no se confirma hasta recibirla.</b>
        </p>
      )}
    </div>
  );
}

/* ---------- Aviso emergente ---------- */

// Ventana en el centro de la pantalla para errores al enviar: en celular un aviso al final
// del formulario puede quedar fuera de la vista.
function Aviso({ aviso }: { aviso: { titulo: string; texto: string } | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aviso && !d.open) d.showModal();
    if (!aviso && d.open) d.close();
  }, [aviso]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="aviso-titulo"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="w-[min(92vw,28rem)] rounded-[10px] p-0 backdrop:bg-black/50"
    >
      <div role="alert" className="p-6 font-articulat">
        <h2 id="aviso-titulo" className="text-xl font-bold text-gray-900">
          {aviso?.titulo}
        </h2>
        <p className="mt-3 text-gray-700 leading-relaxed">{aviso?.texto}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <a
            href={`mailto:${EMAIL_CONTACTO}`}
            className="inline-flex h-11 items-center rounded-[10px] border-2 border-ems-blue px-4 font-medium text-ems-blue hover:bg-ems-blue/10"
          >
            Escribirles
          </a>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            autoFocus
            className="h-11 rounded-[10px] bg-ems-blueStrong px-5 font-semibold text-white hover:bg-[#3A5BCC]"
          >
            Entendido
          </button>
        </div>
      </div>
    </dialog>
  );
}

/* ---------- Envío exitoso ---------- */

function Exito({ linkCarta }: { linkCarta?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(linkCarta!);
      setCopiado(true);
    } catch {}
  }

  return (
    <div className="font-articulat rounded-[10px] border border-gray-200 bg-white px-5 sm:px-10 py-12 shadow-sm">
      <h2 className="text-3xl font-bold text-ems-blue">¡Inscripción enviada!</h2>
      <p className="mt-4 text-lg text-gray-700">
        Gracias. Recibimos tus datos y te enviamos un mail de confirmación.
      </p>

      {linkCarta && (
        <div className="mt-6 rounded-[10px] border-2 border-ems-sun bg-ems-sun/10 p-5">
          <h3 className="font-bold text-gray-900">Falta la carta pastoral</h3>
          <p className="mt-1 text-gray-700">
            Cuando la tengas firmada, subila desde este link. También te lo mandamos por mail.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={linkCarta}
              className="inline-flex h-11 items-center rounded-[10px] bg-ems-blueStrong px-5 font-semibold text-white transition-colors duration-300 hover:bg-[#3A5BCC]"
            >
              Subir la carta
            </a>
            <button
              type="button"
              onClick={copiar}
              className="h-11 rounded-[10px] border-2 border-ems-blue px-5 font-medium text-ems-blue transition-colors duration-300 hover:bg-ems-blue/10"
            >
              {copiado ? "Link copiado" : "Copiar link"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-gray-700">
        En los próximos días nos vamos a comunicar con vos para coordinar la entrevista. Si tenés
        alguna consulta, escribinos a{" "}
        <a href={`mailto:${EMAIL_CONTACTO}`} className="underline">
          {EMAIL_CONTACTO}
        </a>
        .
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-[10px] border-2 border-ems-blue px-5 font-medium text-ems-blue transition-colors duration-300 hover:bg-ems-blue/10"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

/* ---------- Utilidades ---------- */

function mensajeError(el: Control): string {
  if (el.type === "hidden") return "";
  const v = el.validity;
  const texto = el.type !== "checkbox" && el.type !== "radio" && el.type !== "file";
  if (el.required && texto && !el.value.trim()) return "Este campo es obligatorio.";
  if (v.valid) return "";
  if (v.customError) return el.validationMessage;
  if (v.valueMissing) {
    if (el.type === "checkbox") return el.dataset.msg || "Tenés que aceptar este documento para continuar.";
    if (el.type === "radio" || el.tagName === "SELECT") return "Elegí una opción.";
    if (el.type === "file") return "Adjuntá la carta pastoral.";
    return "Este campo es obligatorio.";
  }
  if (v.typeMismatch && el.type === "email") return "Ingresá un mail válido.";
  if (v.patternMismatch || v.rangeOverflow || v.rangeUnderflow || v.badInput) {
    return el.dataset.msg || "Revisá este dato.";
  }
  return el.validationMessage;
}

// Limpia lo que escribió la persona: espacios sobrantes, mail en minúsculas, DNI solo números.
function normalizar(el: Control): string {
  if (el instanceof HTMLTextAreaElement) {
    return el.value.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  }
  if (!(el instanceof HTMLInputElement) || !["text", "email", "tel"].includes(el.type)) return el.value;
  if (el.type === "email") return el.value.replace(/\s/g, "").toLowerCase();
  if (el.name === "DNI") return el.value.replace(/\D/g, "");
  return el.value.trim().replace(/\s+/g, " ");
}

// Cambia el valor con el setter nativo y avisa con un evento "input",
// así React, la validación y el borrador se enteran del cambio.
function ponerValor(el: Control, valor: string) {
  if (el.value === valor) return;
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, valor);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

// Valida una fecha dd/mm/aaaa: que exista y que sea una fecha de nacimiento razonable.
function errorFecha(v: string): string {
  if (!v) return "";
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return "Escribí la fecha como dd/mm/aaaa, por ejemplo 25/03/2000.";
  const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const f = new Date(a, mes - 1, d);
  if (f.getFullYear() !== a || f.getMonth() !== mes - 1 || f.getDate() !== d) {
    return "Esa fecha no existe. Revisá el día y el mes.";
  }
  if (a < 1930 || f > new Date()) return "Revisá el año de nacimiento.";
  return "";
}

// 25032000 → 25/03/2000 (agrega las barras mientras se escribe).
// Si la persona escribe las barras a mano, completa el cero: 15/7/1990 → 15/07/1990.
function formatearFecha(v: string) {
  const partes = v.split("/");
  const n = partes
    .map((p, i) => {
      const d = p.replace(/\D/g, "");
      return i < partes.length - 1 && i < 2 && d.length === 1 ? "0" + d : d;
    })
    .join("")
    .slice(0, 8);
  return [n.slice(0, 2), n.slice(2, 4), n.slice(4)].filter(Boolean).join("/");
}

// "2000-03-25" → "25/03/2000"
function fechaLegible(v: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : v;
}

// Sugiere el dominio conocido más parecido si hay hasta 2 letras de diferencia.
function sugerirMail(mail: string) {
  const m = /^([^@\s]+)@([^@\s]+)$/.exec(mail.trim().toLowerCase());
  if (!m) return "";
  const [, usuario, dominio] = m;
  if (DOMINIOS_MAIL.includes(dominio)) return "";
  let mejor = "";
  let menor = 3;
  for (const d of DOMINIOS_MAIL) {
    const x = distancia(dominio, d);
    if (x < menor) {
      menor = x;
      mejor = d;
    }
  }
  return mejor ? `${usuario}@${mejor}` : "";
}

// Distancia de Levenshtein: cuántas letras hay que cambiar para pasar de a a b.
function distancia(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}
