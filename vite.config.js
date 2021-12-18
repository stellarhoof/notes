// https://vitejs.dev/config/

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/notes",
  minify: false,
  sourcemap: true,
  plugins: [react()],
  server: { https: !process.env.TESTING },
})
