import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

// 근무 기록 insert
export const insertAPI = (workTimeLog) => api({...apiRoutes.workmanagement.insert, data: workTimeLog});

// --------------------- 근무기록 조회
// employeeId로 근무현황 기록 조회
export const getWorkTimeLogsByEmployeeIdAPI = () => api(apiRoutes.workmanagement.getWorkTimeLogsByEmployeeIdAPI);

// 근무현황 기록 유형 목록 조회
export const getAllWorkTimeTypesAPI = () => api(apiRoutes.workmanagement.getAllWorkTimeTypes);

// 근무현황 통계용 조회
export const getWorkSummaryAPI = (startDate, endDate) =>
    api({
        ...apiRoutes.workmanagement.getWorkSummary,
        params: {startDate, endDate}
    });

