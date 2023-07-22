import { http } from "../utils/http";

interface postType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// card list
export const getCardList = (data?: object): postType => {
  return http.request("post", "/getCardList", { data });
};
