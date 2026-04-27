import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function parsePort(value: string | undefined): number {
  if (!value) return 5173;

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT value: "${value}"`);
  }

  return port;
}

function splitHosts(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
}

const port = parsePort(process.env.PORT);
const basePath = process.env.BASE_PATH || "/";

const allowedHosts = Array.from(
  new Set([
    ...splitHosts(process.env.REPLIT_DOMAINS),
    ...splitHosts(process.env.VITE_ALLOWED_HOSTS),
  ]),
);

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: projectRoot,
  build: {
    outDir: path.resolve(projectRoot, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts,
  },
});
