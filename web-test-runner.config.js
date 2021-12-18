import vite from "vite-web-test-runner-plugin"

process.env.TESTING = true

export default {
  plugins: [vite()],
}
