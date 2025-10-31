import apiRoutes from "../common/apiRoutes.js";
import api from "../common/apiInterceptor.js";

// 직원 정보 수정
export const updateEmployeeAPI = (data) =>
    api({...apiRoutes.employee.put, data});

// 내 정보 조회
export const getMyInfoAPI = () => api(apiRoutes.employee.me);

// 직원 목록 조회
export const employeeAllListAPI = () => api(apiRoutes.employee.list);

// 직원 상세 조회
export const employeeDetailAPI = (id) => api(apiRoutes.employee.detail(id));

// 이메일, 폰번호 중복 확인
export const emailDuplCheck = (email, phone) => api(apiRoutes.employee.duplcheck(email, phone));