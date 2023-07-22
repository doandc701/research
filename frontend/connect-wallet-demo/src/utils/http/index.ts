import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  resultType,
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import qs from "qs";
import NProgress from "../progress";
// import { loadEnv } from "@build/index";
import { getToken } from "/@/utils/auth";
import { useUserStoreHook } from "/@/store/modules/user";

// Load environment variable VITE_PROXY_DOMAIN (development environment) VITE_PROXY_DOMAIN_REAL (packaged online environment)
// const { VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = loadEnv();

// For related configuration, please refer to：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // baseURL:
  //   process.env.NODE_ENV === "production"
  //     ? VITE_PROXY_DOMAIN_REAL
  //     : VITE_PROXY_DOMAIN,
  // Currently use mock to simulate the request, make the baseURL empty, if your environment uses http request,
  // please delete the baseURL below to enable the baseURL above, and uncomment the 11th and 16th lines of code.
  baseURL: "",
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // Array format parameter serialization
  paramsSerializer: params => qs.stringify(params, { indices: false })
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // Initialize the configuration object
  private static initConfig: PureHttpRequestConfig = {};

  // Save the current Axios instance object
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  // request interception
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      (config: PureHttpRequestConfig) => {
        const $config = config;
        // Enable progress bar animation
        NProgress.start();
        // Priority is given to judging whether methods such as post/get are passed in and returned,
        // otherwise, the initialization settings are performed and returned.
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback($config);
          return $config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback($config);
          return $config;
        }
        const token = getToken();
        if (token) {
          const data = JSON.parse(token);
          const now = new Date().getTime();
          const expired = parseInt(data.expires) - now <= 0;
          if (expired) {
            // Token expired refresh
            useUserStoreHook()
              .refreshToken(data)
              .then((res: resultType) => {
                config.headers["Authorization"] = "Bearer " + res.accessToken;
                return $config;
              });
          } else {
            config.headers["Authorization"] = "Bearer " + data.accessToken;
            return $config;
          }
        } else {
          return $config;
        }
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  // Response interception
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // Turn off the progress bar animation
        NProgress.done();
        // Priority is given to judging whether methods such as post/get are passed in and returned,
        // otherwise, the initialization settings are performed and returned.
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // Turn off the progress bar animation
        NProgress.done();
        // All response exceptions are differentiated from cancellation request/non-cancellation request
        return Promise.reject($error);
      }
    );
  }

  // Common Request Facility Functions
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // Handle custom request/response callbacks individually
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // Separately extracted post tool function
  public post<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  // Separately extracted get utility function
  public get<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new PureHttp();
