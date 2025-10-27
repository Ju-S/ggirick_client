import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function insertAPI(data) {
    return api({...apiRoutes.approval.insert(), data: data});
}

export function putAPI(approvalId, data) {
    return api({...apiRoutes.approval.put(approvalId), data: data});
}

export function getListAPI(currentPage, box, searchFilter, searchQuery) {
    return api(apiRoutes.approval.getList(currentPage, box, searchFilter, searchQuery));
}

export function getDetailAPI(approvalId) {
    return api(apiRoutes.approval.getDetail(approvalId));
}

export function deleteAPI(approvalId) {
    return api(apiRoutes.approval.delete(approvalId));
}