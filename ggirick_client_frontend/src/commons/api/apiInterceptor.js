import axios from "axios";

const BASE_URL = "http://10.5.5.2:8081";

const api = axios.create();

api.interceptors.request.use(
    (config) => {
        config.baseURL = BASE_URL;
        config.withCredentials = true;
        // config.headers = {
        //         Authorization: `Bearer ${token}` // JWT 강 컨베션
        //     }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;