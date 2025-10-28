import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function deleteFileAPI(fileId) {
    return api(apiRoutes.approvalFile.delete(fileId));
}