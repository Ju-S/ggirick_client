import {create} from 'zustand';
import {getInfos} from "@/api/dashboard/dashboardAPI.js";

const useDashboardStore = create(set => ({
    // 읽지 않은 메일
    vacationCount: 0,

    // 오늘 일정
    calendarCount: 0,

    // 대기중인 결재
    approvalCount: 0,

    // 최신 공지
    newNotification: {},

    // 다가오는 일정 3개 리스트
    calendarList: [],

    // 최근 결재 현황 3개 리스트
    approvalList: [],

    // 최근 활동 3개
    recentActivities: [],

    initLoading: false,
    initDashboard: () => {
        set({initLoading: true});
        getInfos().then(resp => {
            set({
                vacationCount: resp.data.vacationCount || 0,
                calendarCount: resp.data.todayScheduleSize || 0,
                approvalCount: resp.data.pendingApprovalCount || 0,
                newNotification: resp.data.recentNotification || {},
                calendarList: resp.data.upcomingScheduleList || [],
                approvalList: resp.data.recentApprovalHistory || [],
                recentActivities: resp.data.recentActivities || [],
            });
        })
            .finally(() => set({initLoading: false}));
    }
}));

export default useDashboardStore;