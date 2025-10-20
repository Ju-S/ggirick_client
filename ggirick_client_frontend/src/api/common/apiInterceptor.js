import axios from "axios";

// const BASE_URL = "http://10.5.5.7:8081";
//const BASE_URL = "http://192.168.0.8:8081"
const BASE_URL = "http://10.5.5.1:8081";
const api = axios.create();

api.interceptors.request.use(
    async (config) => {
        config.baseURL = BASE_URL;
        config.withCredentials = true;

        const resp = await axios.get(BASE_URL + "/testLogin")
        config.headers = {
            Authorization: `Bearer ${resp.data}` // JWT 강 컨베션
        }
        console.log(config.headers.Authorization);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;