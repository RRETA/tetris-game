# Tetris Game

Juego Tetris construido con React + Vite + TypeScript.

## Controles

- **←/→** — Mover
- **↑/W** — Rotar
- **Espacio** — Hard drop
- **P** — Pausa
- **R** — Reiniciar

## Instalación

```bash
pnpm install
pnpm dev
```

## Configuración de desarrollo

El proyecto usa Vite y escucha en `0.0.0.0` para ser compatible con entornos remotos como Replit. Para evitar riesgos de DNS rebinding, no se permite `allowedHosts: true`.

Si necesitas permitir dominios adicionales para desarrollo remoto, usa una lista explícita:

```bash
VITE_ALLOWED_HOSTS="mi-dominio.dev,otro-host.local" pnpm dev
```

Variables soportadas:

- `PORT`: puerto del servidor. Si no se define, usa `5173`.
- `BASE_PATH`: base path del build. Si no se define, usa `/`.
- `VITE_ALLOWED_HOSTS`: lista separada por comas de hosts permitidos.
- `REPLIT_DOMAINS`: lista de dominios de Replit permitidos automáticamente cuando exista.

## Seguridad

```bash
pnpm audit
pnpm typecheck
pnpm build
```

También se agregó un workflow de GitHub Actions para ejecutar auditoría de severidad alta, typecheck y build en pull requests y pushes a `main`.
