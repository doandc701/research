import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// Get user management list
export const getUserList = (data?: object): ResponseType => {
  return http.request("post", "/user", { data });
};

// Get role management list
export const getRoleList = (data?: object): ResponseType => {
  return http.request("post", "/role", { data });
};

// Get department management list
export const getDeptList = (data?: object): ResponseType => {
  return http.request("post", "/dept", { data });
};
