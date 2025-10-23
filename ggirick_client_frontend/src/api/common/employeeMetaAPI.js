import apiRoutes from "./apiRoutes.js";
import api from "./apiInterceptor.js";
// 부서 목록 조회
export const getDepartmentsAPI = () => api(apiRoutes.hrMeta.departments);

// 직급 목록 조회
export const getJobsAPI = () => api(apiRoutes.hrMeta.jobs);

// 조직 목록 조회
export const getOrganizationsAPI = () => api(apiRoutes.hrMeta.organizations);

// 부서·직급·조직 한번에 불러오기
export const getAllHrMetaAPI = async () => { // async : 비동기로 처리
    try {
        const [deptRes, jobRes, orgRes] = await Promise.all([ // 전체를 한 쌍처럼 묶기
            getDepartmentsAPI(),
            getJobsAPI(),
            getOrganizationsAPI(),
        ]);

        return {
            departments: deptRes.data.map(d => ({ value: d.code, label: d.name })),
            jobs: jobRes.data.map(j => ({ value: j.code, label: j.name })),
            organizations: orgRes.data.map(o => ({ value: o.code, label: o.name,})),
        };
    } catch (err) { // 앱 전체가 멈추는 것을 방지
        console.error("HR 메타데이터 로드 실패:", err);
        throw err;
    }
};


export const getHrMetaStructureAPI = () =>api(apiRoutes.hrMeta.structure);