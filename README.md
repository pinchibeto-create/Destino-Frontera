# Destino Frontera — Naturaleza que conecta

Sitio web estático y adaptable a móviles para Destino Frontera, un proyecto de turismo de naturaleza, cultura y experiencias responsables en el sur de Chiapas. Reconstruido a partir de la identidad visual y 22 fotografías originales recuperadas en agosto de 2026.

## Cómo usar

Requiere Node.js 18 o superior. No necesita instalar bibliotecas.

```bash
npm run dev       # servidor local en http://localhost:4173
npm run build     # genera dist/
npm run preview   # revisa el sitio construido
```

## Publicación con Netlify

1. Conectar este repositorio en Netlify mediante *Add new project > Import an existing project*.
2. Los parámetros están definidos en `netlify.toml`: comando `npm run build` y carpeta `dist`.
3. Antes de recibir contactos reales, **completar `public/privacidad.html` con datos legales del responsable**.
4. Activar **Netlify Forms** en el proyecto. Se incluye el formulario HTML compatible con Netlify. Configure notificaciones a un correo real en Netlify.
5. Asociar el dominio `destinofrontera.com` una vez que la publicación esté lista y configurar DNS y HTTPS.

## Contenidos incluidos

- Portada fotográfica con CTA; navegación móvil.
- Valores de marca, filtros funcionales por destino, experiencias y turismo responsable.
- Formulario de interés de viaje y aviso de privacidad provisional.
- SEO básico, mapa del sitio, favicon y etiquetas sociales.
- 22 fotografías WebP en `public/images/destino-frontera/`; emblema extraído del manual original.

## Por confirmar antes del lanzamiento

- Un medio de contacto público (correo, WhatsApp oficial) y su tratamiento de datos.
- Razón social, domicilio y aviso de privacidad final.
- Disponibilidad, tarifas y operación efectiva de tours, guías y permisos.
- Derechos de uso y atribuciones de cada fotografía, según corresponda.
- La web de Lovable existente es una referencia; **esto es una reconstrucción nueva**, no una exportación de su código fuente.

## Marca

Nombre: **Destino Frontera** · Eslogan: **Naturaleza que conecta**. Paleta: verde bosque `#253322`, oliva `#6C6C31`, salvia `#758458`, teal `#277175`, ocre `#D49721`, arena `#D4C9B4`, crema `#FAF7F1`. Titulares Cinzel y texto Montserrat.
