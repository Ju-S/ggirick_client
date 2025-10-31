import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function getInfos() {
    return api(apiRoutes.dashboard.getInfos());
}