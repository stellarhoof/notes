// https://vitejs.dev/config/

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/notes/",
  build: { minify: false, sourcemap: "inline" },
  plugins: [react()],
  server: { https: !process.env.TESTING },
})
