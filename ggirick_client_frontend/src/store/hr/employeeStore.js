import { create } from "zustand";

const useEmployeeStore = create((set) => ({
    // 전체 사원 목록 (리스트 조회 시 사용)
    employeeList: [],

    // 사원 정보 (상세/수정용)
    employee: {
        id: "",
        name: "",
        phone: "",
        extension: "",
        email: "",
        profileUrl: "",
        departmentCode: "",
        departmentName: "",
        jobCode: "",
        jobName: "",
        organizationCode: "",
        organizationName: "",
        hireDate: "",
        status: "", // ACTIVE / LEAVE / RESIGNED / RETIRED / SUSPENDED,
        statusName: "",
        authority: "", // user / manager / admin
    },

    // 선택한 사원의 재직 이력 리스트
    employmentHistory: [],

    // CRUD 메서드들
    // 전체 리스트 한 번에 세팅
    setEmployeeList: (list) => set({ employeeList: list }),

    // 특정 직원 1명만 업데이트
    updateEmployeeList: (updatedEmp) =>
        set((state) => ({
            employeeList: Array.isArray(state.employeeList)
                ? state.employeeList.map((emp) =>
                    emp.id === updatedEmp.id ? { ...updatedEmp } : emp
                )
                : [updatedEmp],
        })),

    // 사용자 등록
    setEmployee: (employee) => set({ employee: employee }),

    // 사용자 수정
    updateEmployee: (field, value) =>
        set((state) => ({
            employee: {
                ...state.employee,
                [field]: value,
            },
        })),

    // 재직 이력
    setEmploymentHistory: (history) => set({ employmentHistory: history }),

    // 사용자 삭제
    deleteEmployee: () =>
        set({
            employee: {
                id: "",
                name: "",
                phone: "",
                extension: "",
                email: "",
                profileUrl: "",
                departmentCode: "",
                departmentName: "",
                jobCode: "",
                jobName: "",
                organizationCode: "",
                organizationName: "",
                hireDate: "",
                status: "", // ACTIVE / LEAVE / RESIGNED / RETIRED / SUSPENDED
                authority: "", // user / manager / admin
            },
        }),
}));

export default useEmployeeStore;
