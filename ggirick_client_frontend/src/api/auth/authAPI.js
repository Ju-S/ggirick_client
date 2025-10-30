import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function loginAPI(loginInfo) {
    return api({...apiRoutes.auth.login, data: loginInfo});
}

export function checkEmployeeIdAPI(empId) {
    return api(apiRoutes.auth.checkEmployeeId(empId));
}