import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export const getHolidaysByPeriod = (startDate, endDate) => api(apiRoutes.holiday.getHolidaysByPeriod(startDate, endDate));