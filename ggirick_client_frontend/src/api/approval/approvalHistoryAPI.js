import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

export function insertAPI(approvalId, data) {
    return api({...apiRoutes.approvalHistory.insert(approvalId), data: data});
}