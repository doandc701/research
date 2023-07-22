import { App } from "vue";
import axios from "axios";
import { loadEnv } from "@build/index";

let config: object = {};
const { VITE_PUBLIC_PATH } = loadEnv();

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string): ServerConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

// Get project dynamic global configuration
export const getServerConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return axios({
    baseURL: "",
    method: "get",
    url: `${VITE_PUBLIC_PATH}serverConfig.json`
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
      // Tự động đưa cấu hình dự án vào
      if (app && $config && typeof config === "object") {
        $config = Object.assign($config, config);
        app.config.globalProperties.$config = $config;
        // Set global configuration
        setConfig($config);
      }
      // Set global baseURL
      app.config.globalProperties.$baseUrl = $config.baseURL;
      return $config;
    })
    .catch(() => {
      throw "Please add the serverConfig.json configuration file in the public folder";
    });
};

export { getConfig, setConfig };
