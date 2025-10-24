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
        profile_url: "",
        employment_status: "", // ACTIVE / LEAVE / RESIGNED / RETIRED / SUSPENDED
        employee_authority: ""
    },

    // CRUD 메서드들
    // 전체 사원 목록
    setEmployeeList: (list) => set({ employeeList: list }),

    // 사용자 등록
    setEmployee: (employee) => set({ selectedEmployee: employee }),

    // 사용자 수정
    updateEmployee: (field, value) =>
        set((state) => ({
            selectedEmployee: {
                ...state.selectedEmployee,
                [field]: value,
            },
        })),

    // 재직 이력
    setEmploymentHistory: (history) => set({ employmentHistory: history }),

    // 사용자 삭제
    deleteEmployee: () =>
        set({
            selectedEmployee: {
                id: "",
                name: "",
                phone: "",
                extension: "",
                email: "",
                profile_url: "",
                employment_status: "",
            },
        }),
}));

export default useEmployeeStore;
