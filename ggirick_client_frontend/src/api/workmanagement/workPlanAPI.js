import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

// 근무 계획 조회
export const getWorkPlanByPeriod = (startDate, endDate) => api({
    ...apiRoutes.workmanagement.getWorkPlanByPeriod,
    params: {startDate, endDate}
})
