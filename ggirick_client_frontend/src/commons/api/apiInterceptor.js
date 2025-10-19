import axios from "axios";

const BASE_URL = "http://192.168.45.219:8081";

const api = axios.create();

api.interceptors.request.use(
    async (config) => {
        config.baseURL = BASE_URL;
        config.withCredentials = true;
      const resp = await axios.get(BASE_URL + "/testLogin")
      config.headers = {
        Authorization: `Bearer ${resp.data}` // JWT 강 컨베션
      }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;