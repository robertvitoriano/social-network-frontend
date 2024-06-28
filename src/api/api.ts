import axios from "axios";
export const api = axios.create({
  baseURL: "http://localhost:3334",
});
const requestIntercepter = (config: any) => {
  //@ts-ignore
  config.headers.Authorization = "Bearer " + localStorage.getItem("token");
  return config;
};

api.interceptors.request.use(requestIntercepter);

// api.interceptors.response.use(
//   (response) => response,
//   (err) => {
//     const authorizedUserError =
//       err.response && err.response.status !== 401 && err.response.status < 500;
//     const unauthorizedUserError = err.response && err.response.status === 401;
//     if (unauthorizedUserError) {
//       // localStorage.clear();
//       // location.reload();
//       return Promise.reject(null);
//     }

//     if (authorizedUserError) {
//       console.error(err);
//       return Promise.reject(err);
//     }
//   }
// );
