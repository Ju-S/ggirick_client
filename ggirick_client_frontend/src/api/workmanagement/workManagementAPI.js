import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

// 근무 기록 insert
export const insertAPI = (workTimeLog) => api({...apiRoutes.workmanagement.insert, data: workTimeLog});

// --------------------- 근무기록 조회
// employeeId로 근무현황 기록 조회
export const getWorkTimeLogsByEmployeeIdAPI = () => api(apiRoutes.workmanagement.getWorkTimeLogsByEmployeeIdAPI);

// 근무현황 기록 유형 목록 조회
export const getAllWorkTimeTypesAPI = () => api(apiRoutes.workmanagement.getAllWorkTimeTypes);

// 근무기록 기간 + 유형으로 조회
export const getlistByTypeAndPeriodAPI = (startDate, endDate, type) => api(apiRoutes.workmanagement.getlistByTypeAndPeriod(startDate, endDate, type));

// 근무현황 통계용 조회
export const getWorkSummaryAPI = (startDate, endDate) =>
    api({
        ...apiRoutes.workmanagement.getWorkSummary,
        params: {startDate, endDate}
    });

// 연간 근무 현황 조회 - 지각/조퇴/퇴근누락/결근 횟수용
export const getWorkAttendanceAPI = (startDate, endDate) =>
    api({
        ...apiRoutes.workmanagement.getWorkAttendanceAPI,
        params: {startDate, endDate}
    });

