// import { http } from "../utils/http";
/*
Demo
console.log('http', http)
const k = 'https://vpunks.herokuapp.com/app/funding-check02?address=0xd650fddd1f9b220d69c50e4014a168c10a934695'
http.request("get", k).then((h) => {
  console.log('h', h)
});

const c = { headers: {'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'}};

http.request("get", 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', c).then((h) => {
  console.log('h2:', h)
});
*/

export const getAsyncRoutes = (params?: object) => {
  // return http.request("get", "/getAsyncRoutes", { params });
  // tạm thời không request AsyncRoutes
  return new Promise(resolve => {
    resolve({ info: [], params });
  });
};
