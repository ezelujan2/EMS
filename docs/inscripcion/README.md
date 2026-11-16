# Formulario de inscripción: puesta en marcha

El formulario de la web (`/inscripcion`) guarda cada inscripción en una Google Sheet, sube la
carta pastoral a Drive y manda mails. No hace falta base de datos ni servidor.

```
Web /inscripcion ──POST──▶ Google Apps Script ──▶ Hoja "Inscripciones" (una fila por persona)
                                                ──▶ Carpeta de Drive (cartas pastorales)
                                                ──▶ Mail al inscripto + aviso al equipo
Web /inscripcion/carta ──▶ (carta subida después) ──▶ completa la misma fila
```

## 1. Crear la planilla y el script (una sola vez)

Hacelo con **cualquier cuenta de Google de la escuela**: la planilla y las cartas quedan en el
Drive de esa cuenta, y los mails de confirmación salen desde ella. Después compartí la planilla y la
carpeta con quien la necesite (por ejemplo infoescuelams@gmail.com).

1. Crear una Google Sheet nueva, por ejemplo "Inscripciones EMS 2027".
2. Menú **Extensiones → Apps Script**.
3. Borrar lo que haya y pegar el contenido de [`Codigo.gs`](./Codigo.gs).
4. Revisar `CONFIG` al principio del archivo y guardar (💾):
   - `EMAILS_AVISO`: los mails que reciben el aviso de cada inscripción, entre comillas y separados
     por coma, por ejemplo `["infoescuelams@gmail.com", "otra@escuela.com"]`.
   - `RESPONDER_A`: a dónde llega la respuesta si un inscripto contesta el mail de confirmación.
   - `SITIO`: la dirección pública de la web (se usa para el link de "subir la carta después").
5. En el selector de funciones de arriba elegir **`autorizar`** y tocar **Ejecutar**.
   Google pide permisos: *Revisar permisos → elegir la cuenta → Configuración avanzada →
   Ir a (proyecto) → Permitir*. El aviso de "app no verificada" es normal porque el script es de
   ustedes.
6. **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
7. Copiar la **URL de la aplicación web** (termina en `/exec`).

Para comprobar que funciona, abrí esa URL en el navegador. Tiene que mostrar algo como
`{"ok":true,"servicio":"Inscripción EMS activa","abiertas":true,...}`.

Al ejecutar `autorizar` se crean las pestañas **Configuración** y **Resumen**. Recargá la planilla
y va a aparecer el menú **EMS** arriba (al lado de "Ayuda").

## 2. Conectar la web

Pegar la URL en `components/inscripcion/config.ts`:

```ts
export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_INSCRIPCION_URL ?? "https://script.google.com/macros/s/XXXX/exec";
```

O definir la variable de entorno `NEXT_PUBLIC_INSCRIPCION_URL` en Netlify (*Site configuration →
Environment variables*). Se lee al hacer el build, así que después de cambiarla hay que volver a
desplegar.

**Probalo antes de anunciarlo:** hacé una inscripción de prueba completa (una con la carta y otra
eligiendo "La subo después") y revisá la planilla, la carpeta de Drive y los mails. Después borrá
esas filas de prueba.

## 3. Menú "EMS" en la planilla

- **Preparar planilla:** crea las pestañas Configuración y Resumen si faltan.
- **Activar recordatorios semanales de carta:** todos los lunes a las 9 manda un mail con el link a
  quien siga en "Carta pendiente" (como máximo 4 recordatorios por persona, uno por semana). La
  primera vez Google pide permiso para "ejecutar cuando no estás presente": aceptalo.
- **Desactivar recordatorios semanales.**
- **Enviar recordatorios de carta ahora:** lo mismo, en el momento (respeta el "uno por semana").

## 4. Abrir o cerrar las inscripciones

En la pestaña **Configuración**:

| Opción | Qué hace |
|---|---|
| Inscripciones abiertas | **SÍ** o **NO**. Con NO, la web muestra el mensaje en vez del formulario y el script rechaza envíos. |
| Mensaje cuando están cerradas | Lo que ve la gente en `/inscripcion`. |
| Abiertas hasta el (opcional) | Fecha de cierre automático, inclusive. Vacía = sin cierre automático. |

El cambio es inmediato: no hay que tocar la web ni volver a publicar nada.

## 5. Ver a los inscriptos

- **Planilla:** una fila por inscripción, con todos los datos. La fila de títulos queda fija.
  - **ID:** código corto para identificar a cada persona.
  - **Estado:** tiene una lista desplegable (Carta pendiente, Inscripción completa, Entrevista
    coordinada, Aceptado, No aceptado) para hacer el seguimiento.
  - **Carta pastoral:** link al archivo en Drive.
- **Darle acceso al equipo:** compartir la planilla **y** la carpeta "Inscripciones EMS - Cartas
  pastorales" (en Drive) con los mails de las personas que la necesiten. Sin la carpeta
  compartida, los links a las cartas no les abren.
- **Resumen:** pestaña con el total de inscriptos, cartas pendientes y conteos por estado, año de
  cursado, cómo conocieron la EMS y localidad. Se actualiza sola; no escribas ahí.
- **Recordatorios / Último recordatorio:** columnas que agrega el recordatorio de carta.
- **Avisos:** cada inscripción y cada carta subida después llegan como mail a los de `EMAILS_AVISO`.
- Se puede filtrar, ordenar o descargar como Excel desde *Archivo → Descargar*.
- La columna **Token carta** es interna (el link secreto para subir la carta después); se vacía
  cuando la carta llega. Se puede ocultar, pero no borrar.

## Reglas que aplica el script

- **DNI duplicado:** no deja inscribir dos veces el mismo DNI en el mismo ciclo. La persona ve un
  mensaje para que les escriba.
- **Carta después:** la fila queda en "Carta pendiente" y la persona recibe un link de un solo uso
  para subirla. Cuando la sube, la fila pasa a "Inscripción completa".
- **Fotos:** el formulario convierte las fotos a JPG y las achica antes de subirlas.

## Cambios en el script

Si editás `Codigo.gs`, los cambios **no se publican solos**. Entrá a *Implementar → Gestionar
implementaciones → ✏️ → Versión: Nueva versión → Implementar*. Así la URL sigue siendo la misma.

## Documentos (matrícula, estilo de vida, reglas, carta pastoral)

Están en `public/documents/`, configurados en `DOCUMENTOS` de `components/inscripcion/config.ts`.

- Cada documento para aceptar tiene dos archivos con el mismo nombre: el **PDF** (para descargar)
  y una **imagen `.webp`** de sus páginas (es lo que se ve en la ventana "Leer", porque los
  celulares no muestran bien un PDF incrustado).
- La matrícula tiene dos versiones: la de **1° y 2° año** y la de **3° año**. El formulario muestra
  la que corresponde según el año elegido, y en la planilla queda cuál aceptó la persona.
- La **carta pastoral** es solo PDF (se descarga para imprimir).

Si cambia un PDF, hay que reemplazarlo **y volver a generar su imagen**; si no, en la ventana
"Leer" se sigue viendo la versión anterior.

## Cada año

- En `config.ts`: cambiar `CICLO` y, si cambian, los links a los documentos.
- Abrir o cerrar las inscripciones desde la pestaña Configuración.
- Crear una planilla nueva y repetir el paso 1, o seguir usando la misma (se distingue por la
  columna `Ciclo`; el control de DNI duplicado es por ciclo).

## Límites a tener en cuenta

- Gmail gratis permite unos **100 mails por día** desde Apps Script. Cada inscripción manda 2
  (al inscripto y al equipo), así que entran unas 50 inscripciones por día con mail. Si se supera,
  la inscripción **se guarda igual**; solo se pierde el mail. Quien eligió subir la carta después
  igual ve el link en la pantalla final.
- La carta pastoral puede pesar hasta 10 MB.
- El progreso del formulario (incluida la carta elegida) se guarda **en el navegador de cada
  persona**: si cambia de celular o de navegador, empieza de nuevo.
