import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWorkTimeLogStore = create(
    persist(
        (set) => ({
            logs: [],

            // 근무현황 추가
            setLogs: (type) => {
                const now = new Date(); // 현재 시간 가져오기
                // 날짜 포맷팅
                const formatted = `${now
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${now
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`;
                set((state) => ({
                    logs: [...state.logs, { time: formatted, type }],
                }));
            },

            // 근무현황 삭제
            deleteLogs: () => set({ logs: [] }),

            // 근무 현황 수정
            updateLogs: () => set({ logs: []})
        }),
        // 로컬 스토리지에 저장
        {
            name: "workTimeLogs", // localStorage 키 이름
            getStorage: () => localStorage,
        },
    )
);

export default useWorkTimeLogStore;
