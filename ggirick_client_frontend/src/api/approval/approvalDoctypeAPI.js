import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function getDoctypeAPI() {
    return api(apiRoutes.approvalDoctype.getList());
}