import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

export const itemByPeriodAPI = (startDate, endDate) =>  api(apiRoutes.workmanagement.itemByPeriod(startDate, endDate));

export const insertAPI =
