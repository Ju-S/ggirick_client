import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

// --------------------- 휴가 관련
// employeeId로 잔여 휴가일수 조회
export const getRemainingVacationAPI = () => api(apiRoutes.workmanagement.getRemainingVacation);