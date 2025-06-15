import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // server: {
    //   port: 5173,
    //   host: "app.falconone.com",

    // },
    server: {
      https: false, // Ensures that the server uses HTTP instead of HTTPS,
      headers: {
      "Content-Security-Policy": "upgrade-insecure-requests"
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@styled-components": path.resolve(
          __dirname,
          "./src/components/styled"
        ),
        "@feature-components": path.resolve(
          __dirname,
          "./src/components/features"
        ),
        "@ui-components": path.resolve(
          __dirname,
          "./src/components/ui-components"
        ),
        "@models": path.resolve(__dirname, "./src/models"),
        "@slices": path.resolve(__dirname, "./src/store/Slices"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@endpoints": path.resolve(__dirname, "./src/endpoints"),
        "@validation-schemes": path.resolve(
          __dirname,
          "./src/validation-schemes"
        ),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@enumerations": path.resolve(__dirname, "./src/enumerations"),
        "@utilities": path.resolve(__dirname, "./src/utilities"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@guards": path.resolve(__dirname, "./src/guards"),
        "@layouts": path.resolve(__dirname, "./src/layouts"), // Corrected path
        "@locales": path.resolve(__dirname, "./src/locales"), // Corrected path
        "@mui-tiptap": path.resolve(
          __dirname,
          "./node_modules/mui-tiptap/dist"
        ),
        "@mui-tiptap-controls": path.resolve(
          __dirname,
          "./node_modules/mui-tiptap/dist/controls"
        ),
        "@tiptap": path.resolve(__dirname, "./node_modules/@tiptap"),
      },
    },

    define: {
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [react()],
  };
});
