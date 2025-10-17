Despliegue a GitHub Pages

Instrucciones mínimas para desplegar la carpeta `app` en GitHub Pages.

- El workflow `.github/workflows/deploy.yml` construye la app usando `pnpm build` en `app/` y publica `app/dist` a la rama `gh-pages` con `peaceiris/actions-gh-pages`.
- Para que la aplicación funcione correctamente en GitHub Pages, Vite necesita la opción `base` configurada. Ya se añadió soporte en `vite.config.ts` para leer la variable de entorno `VITE_BASE`.

Recomendación de configuración:

1. Si usas GitHub Pages con el repositorio (no dominio personalizado), el `base` debe ser `/<repo-name>/`. El workflow intenta configurar `VITE_BASE` automáticamente; sin embargo, revisa el valor en caso de que necesites un `base` distinto.

2. Si tienes un dominio personalizado, establece `VITE_BASE` a `'/'` y configura el dominio en la configuración de Pages.

3. Para probar localmente con el mismo base:

```bash
# en macOS / zsh
cd app
VITE_BASE='/my-repo/' pnpm build
pnpm preview --port 4173
```

4. Asegúrate de habilitar GitHub Pages en Settings > Pages y seleccionar la rama `gh-pages` como fuente si no se configura automáticamente.

Notas:
- Si usas un workspace monorepo con `pnpm` (como aquí), el workflow instala dependencias en `app` antes de construir.
- Puedes customizar la rama de publicación cambiando `publish_branch` en el workflow.
