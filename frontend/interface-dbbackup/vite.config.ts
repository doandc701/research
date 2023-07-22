import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: false,
    port: 8000,
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      "/foo": "http://localhost:8000",
    },
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

// export default ({ mode }: any) => {
//   // Load app-level env vars to node-level env vars.
//   process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
//   return defineConfig({
//     plugins: [vue()],
//     resolve: {
//       alias: {
//         "@": fileURLToPath(new URL("./src", import.meta.url)),
//       },
//     },
//   });
// };
