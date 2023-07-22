import dayjs from "dayjs";
import { resolve } from "path";
import pkg from "./package.json";
import { warpperEnv, regExps } from "./build";
import { getPluginsList } from "./build/plugins";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";
// The address of the folder (working directory) when the node command is currently executed
const root: string = process.cwd();

// pathfinding
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// set alias
const alias: Record<string, string> = {
  "/@": pathResolve("src"),
  "@build": pathResolve("build")
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const {
    VITE_PORT,
    VITE_LEGACY,
    VITE_PUBLIC_PATH,
    VITE_PROXY_DOMAIN,
    VITE_PROXY_DOMAIN_REAL
  } = warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // server-side rendering
    server: {
      // Whether to enable https
      https: false,
      // The port number
      port: VITE_PORT,
      host: "0.0.0.0",
      // Local cross-domain proxy
      proxy:
        VITE_PROXY_DOMAIN_REAL.length > 0
          ? {
              [VITE_PROXY_DOMAIN]: {
                target: VITE_PROXY_DOMAIN_REAL,
                // ws: true,
                changeOrigin: true,
                rewrite: (path: string) => regExps(path, VITE_PROXY_DOMAIN)
              }
            }
          : null
    },
    plugins: getPluginsList(command, VITE_LEGACY),
    optimizeDeps: {
      include: ["pinia", "vue-i18n", "lodash-es", "@vueuse/core", "dayjs"],
      exclude: ["@pureadmin/theme/dist/browser-utils"]
    },
    build: {
      sourcemap: false,
      // Eliminate pack size over 500kb warning
      chunkSizeWarningLimit: 4000
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      global: "globalThis"
    }
  };
};
