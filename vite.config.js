import { defineConfig } from "vite";
// console.log("vite.config.js");
// export default defineConfig({
//   server: {
//     headers: {
//       "Cross-Origin-Embedder-Policy": "require-corp",
//       "Cross-Origin-Opener-Policy": "same-origin",
//     },
//   },
// });
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "localhost",
      protocol: "ws",
    }
  }
});