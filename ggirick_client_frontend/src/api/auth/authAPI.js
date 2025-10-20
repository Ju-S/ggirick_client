import apiRoutes from "../common/apiRoutes.js";
import api from "../common/apiInterceptor.js";


export function loginAPI(loginInfo) {
    return api({...apiRoutes.auth.login, data: loginInfo});
}

export function checkEmployeeIdAPI(empId) {
    return api(apiRoutes.auth.checkEmployeeId(empId));
}