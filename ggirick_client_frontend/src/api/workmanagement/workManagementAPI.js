import apiRoutes from "@/api/common/apiRoutes.js";
import api from "@/api/common/apiInterceptor.js";

// ---------
// 근무 기록 insert
export const insertAPI = (workTimeLog) => api({...apiRoutes.workmanagement.insert, data: workTimeLog});

// 근무 계획 기록
export const updateAPI = (workRecords, employeeId) => api({...apiRoutes.workmanagement.put(employeeId), data:workRecords})

// --------- 조회
// employeeId로 조회
export const getWorkTimeLogsByEmployeeIdAPI = () => api(apiRoutes.workmanagement.getWorkTimeLogsByEmployeeIdAPI);


export const itemByPeriodAPI = (startDate, endDate) =>  api(apiRoutes.workmanagement.itemByPeriod(startDate, endDate));

// 근무현황 기록 유형 목록 조회
export const getAllWorkTimeTypesAPI = () => api(apiRoutes.workmanagement.getAllWorkTimeTypes);
