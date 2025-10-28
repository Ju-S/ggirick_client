import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

// ---------------------
// 근무 기록 insert
export const insertAPI = (workTimeLog) => api({...apiRoutes.workmanagement.insert, data: workTimeLog});

// 근무 계획 기록
export const updateAPI = (workRecords, employeeId) => api({...apiRoutes.workmanagement.put(employeeId), data:workRecords})

// --------------------- 근무기록 조회
// employeeId로 근무현황 기록 조회
export const getWorkTimeLogsByEmployeeIdAPI = () => api(apiRoutes.workmanagement.getWorkTimeLogsByEmployeeIdAPI);

// 근무현황 기록 유형 목록 조회
export const getAllWorkTimeTypesAPI = () => api(apiRoutes.workmanagement.getAllWorkTimeTypes);

// 근무현황 통계용 조회
export const getWorkSummaryAPI = (period, startDate, endDate) =>
    api({
        ...apiRoutes.workmanagement.getWorkSummary,
        params: {period, startDate, endDate}
    });

// --------------------- 휴가 관련
// employeeId로 잔여 휴가일수 조회
export const getRemainingVacationAPI = () => api(apiRoutes.workmanagement.getRemainingVacation);