import { create } from "zustand";

const useCommonStore = create((set) => ({
    // 공통 목록 데이터
    departments: [],
    jobs: [],
    organizations: [],

    // setter 메서드들
    setDepartments: (data) => set({ departments: data }),
    setJobs: (data) => set({ jobs: data }),
    setOrganizations: (data) => set({ organizations: data }),

    // 한꺼번에 세팅하고 싶을 때
    setAllCommonData: (data) => set(data),
}));

export default useCommonStore;
