# Formulario de inscripción: puesta en marcha

El formulario de la web (`/inscripcion`) guarda cada inscripción en una Google Sheet,
sube la carta pastoral a Drive y manda mails. No hace falta base de datos ni servidor.

```
Web /inscripcion  ──POST──▶  Google Apps Script  ──▶  Sheet "Inscripciones"
                                                 ──▶  Carpeta de Drive (cartas)
                                                 ──▶  Mail al inscripto + aviso al equipo
```

## 1. Crear la planilla y el script (una sola vez)

Hacelo con la cuenta **infoescuelams@gmail.com**: los mails salen de esa cuenta y
la planilla y las cartas quedan en su Drive.

1. Crear una Google Sheet nueva, por ejemplo "Inscripciones EMS 2027".
2. Menú **Extensiones → Apps Script**.
3. Borrar lo que haya y pegar el contenido de [`Codigo.gs`](./Codigo.gs). Guardar (💾).
4. En el selector de funciones de arriba elegir **`autorizar`** y tocar **Ejecutar**.
   Google pide permisos: *Revisar permisos → elegir la cuenta → Configuración avanzada →
   Ir a (proyecto) → Permitir*. El aviso de "app no verificada" es normal porque el
   script es de ustedes.
5. **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Copiar la **URL de la aplicación web** (termina en `/exec`).

Para comprobar que funciona, abrí esa URL en el navegador. Tiene que mostrar
`{"ok":true,"mensaje":"Servicio de inscripción EMS activo"}`.

## 2. Conectar la web

Pegar la URL en `components/inscripcion/config.ts`:

```ts
export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_INSCRIPCION_URL ?? "https://script.google.com/macros/s/XXXX/exec";
```

También podés definir la variable de entorno `NEXT_PUBLIC_INSCRIPCION_URL` en el hosting.
Esa variable se lee al hacer el build, así que después de cambiarla hay que volver a desplegar.

## Cambios en el script

Si editás `Codigo.gs`, los cambios **no se publican solos**. Entrá a *Implementar →
Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar*. Así la URL
sigue siendo la misma.

## Cada año

- En `config.ts`: cambiar `CICLO` y, si cambian, los links a los documentos.
- Crear una planilla nueva y repetir el paso 1, o seguir usando la misma y filtrar
  por la columna `Ciclo`.

## Límites a tener en cuenta

- Gmail gratis permite unos **100 mails por día** desde Apps Script. Cada inscripción
  manda 2, así que entran unas 50 inscripciones por día con mail.
  Si se supera, la inscripción **se guarda igual** y solo se pierde el mail.
- La carta pastoral puede pesar hasta 10 MB.
- Para agregar o quitar preguntas, alcanza con editar el formulario en
  `components/inscripcion/inscripcion-form.tsx`. Las columnas nuevas aparecen solas en la planilla.
