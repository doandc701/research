import { http } from "../utils/http";

export const getLocalFile = (url: string) => {
  return http.request("get", url);
};
