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
  APPS_SCRIPT_URL,
  AÑOS_CURSADO,
  CICLO,
  DOCUMENTOS,
  EMAIL_CONTACTO,
  LOCALIDADES,
  MAX_ARCHIVO_MB,
} from "./config";

const PASOS = ["Datos personales", "Inscripción", "Iglesia", "Salud", "Carta pastoral", "Revisión"];
const PASO_CARTA = 4;
const REVISION = PASOS.length - 1;

const HONEYPOT = "_website";
const OTRA = "__otra";
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
  const [error, setError] = useState("");
  const [errores, setErrores] = useState<Datos>({});
  const [borrador, setBorrador] = useState<Datos>({});
  const [restaurado, setRestaurado] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [resumen, setResumen] = useState<Seccion[]>([]);

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
            v = el.checked ? "Leído y aceptado" : "";
          } else if (el instanceof HTMLInputElement && el.type === "file") {
            v = el.files?.[0]?.name ?? "";
          } else if (el.tagName === "SELECT" && v === "Otra") {
            const otra = form.elements.namedItem(el.name + OTRA) as HTMLInputElement | null;
            v = `Otra: ${otra?.value ?? ""}`;
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
    // Radios, checkboxes y selects se validan al elegir; el resto, si ya tenía error.
    const inmediato = ["radio", "checkbox", "file", "select-one"].includes(el.type);
    revalidar(el, inmediato);
    guardar();
  }

  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const el = e.target as unknown as Control;
    if (!("validity" in el) || !el.name) return;
    // Al salir del campo solo marcamos errores de formato, no los vacíos.
    if (el.value.trim()) revalidar(el, true);
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
    setError("");

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
        // "Otra" localidad: junta el select con el texto escrito.
        if (k.endsWith(OTRA)) {
          const base = k.slice(0, -OTRA.length);
          if (campos[base] === "Otra") campos[base] = `Otra: ${campos[k]}`;
          delete campos[k];
        }
        // Auxiliares de las preguntas Sí/No (ya combinados en el campo principal).
        if (k.endsWith("__op") || k.endsWith("__detalle")) delete campos[k];
      }

      if (!APPS_SCRIPT_URL) throw new Error("Falta configurar APPS_SCRIPT_URL");

      const payload = {
        ciclo: CICLO,
        campos,
        archivo: archivo ? await leerArchivo(archivo) : null,
      };

      // Sin Content-Type explícito el navegador manda text/plain y
      // evita el preflight CORS, que Apps Script no soporta.
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error desconocido");

      borrarBorrador();
      setEstado("enviado");
      topRef.current?.scrollIntoView({ block: "start" });
    } catch (err) {
      console.error(err);
      setError(
        `No se pudo enviar la inscripción. Tus respuestas quedaron guardadas: intentá de nuevo en unos minutos o escribinos a ${EMAIL_CONTACTO}.`
      );
      setEstado("error");
    }
  }

  if (estado === "enviado") {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <Exito />
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
              name="Mail"
              type="email"
              autoComplete="email"
              inputMode="email"
              ayuda="Preferentemente una cuenta de Gmail. Te vamos a escribir a esta dirección."
            />
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
            <div className="space-y-3">
              <Etiqueta>Documentos</Etiqueta>
              <p className="text-sm text-gray-500 -mt-1">Abrí y leé cada documento para poder aceptarlo.</p>
              <Acepto name="Matrícula" href={DOCUMENTOS.matricula} doc={`Matrícula ${CICLO}`} />
              <Acepto name="Estilo de vida del avivador" href={DOCUMENTOS.estiloDeVida} doc="Estilo de vida del avivador" />
              <Acepto name="Reglas y normas del alumno" href={DOCUMENTOS.reglasYNormas} doc="Reglas y normas del alumno" />
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
          </Paso>

          <Paso n={PASO_CARTA} actual={paso} titulo="Recomendación pastoral">
            <ol className="space-y-2 text-gray-700">
              {[
                "Descargá la carta pastoral.",
                "Pedile a tu pastor que la complete y la firme.",
                "Subila acá en PDF o como foto.",
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

          {estado === "error" && (
            <p role="alert" className="mt-8 rounded-[10px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

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
              className={`h-12 px-6 rounded-[10px] font-medium text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-wait ${
                paso === REVISION ? "bg-ems-sun hover:bg-[#F0B400]" : "bg-ems-blue hover:bg-[#5F86F5]"
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

function Opciones({ name, label, opciones }: { name: string; label: string; opciones: string[] }) {
  const error = useError(name);
  const guardado = useBorrador(name);
  const id = slug(name);
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`}>
      <Etiqueta id={`${id}-label`}>{label}</Etiqueta>
      <div className="grid gap-2 sm:grid-cols-3">
        {opciones.map((op) => (
          <label key={op} className={`${opcionCls} ${error ? "border-red-400" : ""}`}>
            <input
              type="radio"
              name={name}
              value={op}
              required
              defaultChecked={guardado === op}
              data-resumen={label}
              className={radioCls}
            />
            {op}
          </label>
        ))}
      </div>
      <MensajeError error={error} />
    </div>
  );
}

// La casilla solo se puede marcar después de abrir el documento.
// El documento se muestra dentro de la página y se acepta desde ahí.
function Acepto({ name, href, doc }: { name: string; href: string; doc: string }) {
  const error = useError(name);
  const yaAceptado = !!useBorrador(name);
  const [abierto, setAbierto] = useState(yaAceptado);
  const [aviso, setAviso] = useState(false);
  const checkRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function abrir() {
    setAbierto(true);
    setAviso(false);
    dialogRef.current?.showModal();
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
            value="Leído y aceptado"
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
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      >
        <div className="flex h-full flex-col font-articulat">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
            <span className="font-bold text-gray-900">{doc}</span>
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 underline">
              Abrir en otra pestaña
            </a>
          </div>
          <iframe src={vistaPrevia(href)} title={doc} className="w-full flex-1" loading="lazy" />
          <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-11 px-4 rounded-[10px] border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={aceptar}
              className="h-11 px-5 rounded-[10px] bg-ems-blue font-medium text-white transition-colors duration-300 hover:bg-[#5F86F5]"
            >
              Leí y acepto
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

// Convierte un link de Google Docs (/edit) en su vista para incrustar (/preview).
function vistaPrevia(url: string) {
  return url.replace(/\/(edit|view)[^/]*$/, "/preview");
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

function Archivo() {
  const name = "Carta pastoral";
  const [archivo, setArchivo] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const error = useError(name);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setArrastrando(false);
    const input = e.target;
    const f = input.files?.[0];
    input.setCustomValidity("");
    if (!f) return setArchivo(null);
    const tipoOk = f.type === "application/pdf" || f.type.startsWith("image/");
    if (!tipoOk) input.setCustomValidity("El archivo tiene que ser un PDF o una imagen.");
    else if (f.size > MAX_ARCHIVO_MB * 1024 * 1024)
      input.setCustomValidity(`El archivo pesa más de ${MAX_ARCHIVO_MB} MB.`);
    setArchivo(input.validity.valid ? f.name : null);
  }

  return (
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
        {archivo ? (
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
          id="carta-pastoral"
          type="file"
          name={name}
          accept="application/pdf,image/*"
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
        . La inscripción no se confirma sin la carta.
      </p>
    </div>
  );
}

/* ---------- Envío exitoso ---------- */

function Exito() {
  return (
    <div className="font-articulat rounded-[10px] border border-gray-200 bg-white px-5 sm:px-10 py-12 shadow-sm">
      <h2 className="text-3xl font-bold text-ems-blue">¡Inscripción enviada!</h2>
      <p className="mt-4 text-lg text-gray-700">
        Gracias. Recibimos tus datos y te enviamos un mail de confirmación.
      </p>
      <p className="mt-2 text-gray-700">
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
    if (el.type === "checkbox") return "Tenés que aceptar este documento para continuar.";
    if (el.type === "radio" || el.tagName === "SELECT") return "Elegí una opción.";
    if (el.type === "file") return "Adjuntá la carta pastoral.";
    return "Este campo es obligatorio.";
  }
  if (v.typeMismatch && el.type === "email") return "Ingresá un mail válido.";
  if (v.patternMismatch) return el.dataset.msg || "Revisá este dato.";
  return el.validationMessage;
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function leerArchivo(f: File): Promise<{ nombre: string; tipo: string; base64: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ nombre: f.name, tipo: f.type, base64: String(r.result).split(",")[1] });
    r.onerror = () => reject(r.error);
    r.readAsDataURL(f);
  });
}
