// Handling environment variables
const warpperEnv = (envConf: Recordable): ViteEnv => {
  // This is the default value, no need to modify
  const ret: ViteEnv = {
    VITE_PORT: 8848,
    VITE_PUBLIC_PATH: "",
    VITE_PROXY_DOMAIN: "",
    VITE_PROXY_DOMAIN_REAL: "",
    VITE_ROUTER_HISTORY: "",
    VITE_LEGACY: false
  };

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName =
      realName === "true" ? true : realName === "false" ? false : realName;

    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    ret[envName] = realName;
    if (typeof realName === "string") {
      process.env[envName] = realName;
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
};

// Cross-domain proxy rewrite
const regExps = (value: string, reg: string): string => {
  return value.replace(new RegExp(`^${reg}`, "g"), "");
};

// environment variable
const loadEnv = (): ViteEnv => {
  return import.meta.env;
};

export { warpperEnv, regExps, loadEnv };
