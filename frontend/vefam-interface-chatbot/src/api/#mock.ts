import { http } from "../utils/http";

// map data
export const mapJson = (params?: object) => {
  return http.request("get", "/getMapInfo", { params });
};
