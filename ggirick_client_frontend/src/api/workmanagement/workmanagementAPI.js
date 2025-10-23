import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

export const getWorkTimeLogByPeriodAPI = () =>  api(apiRoutes.workmanagement.getWorkTimeLogByPeriod(startDate, endDate));