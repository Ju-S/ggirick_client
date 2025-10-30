import axios from "axios";

const api = axios.create();

api.interceptors.request.use(
    async (config) => {
        config.baseURL = BASE_URL;
        config.withCredentials = true;
        const token = sessionStorage.getItem("token");
        config.headers = {
            Authorization: `Bearer ${token}` // JWT 강 컨베션
        }

        console.log(config.headers.Authorization);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;