import { http } from "../utils/http";

export const game01Leaderboard = (query: string) => {
  return http.request(
    "get",
    `https://vpunks.herokuapp.com/app/game01-leaderboard?${query}`
  );
};
