import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function getTypeAPI() {
    return api(apiRoutes.approvalType.getList());
}