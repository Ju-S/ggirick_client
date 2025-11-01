import './Dashboard.css';
import useWorkCheck from "@/hooks/workmanagement/useWorkCheck.js";
import WorkCheckCardGrid from "@/components/dashboard/WorkCheckCardGrid.jsx";
import WorkStatusPanel from "@/components/workmanagement/WorkStatusPanel.jsx";
import {useEffect} from "react";
import useDashboardStore from "@/store/dashboard/useDashboardStore.js";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards.jsx";
import DashboardUpcomingSchedule from "@/components/dashboard/DashboardUpcomingSchedule.jsx";
import DashboardRecentApprovalHistory from "@/components/dashboard/DashboardRecentApprovalHistory.jsx";
import DashboardRecentActivities from "@/components/dashboard/DashboardRecentActivities.jsx";

export default function Dashboard() {
    const {
        workTimeLogs,
        workTimeTypes,
        hasCheckedIn,
        hasCheckedOut,
        handleCheck,
    } = useWorkCheck();

    const initDashboard = useDashboardStore(state => state.initDashboard);
    const initLoading = useDashboardStore(state => state.initLoading);

    useEffect(() => {
        initDashboard();
    }, []);

    if (initLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen w-full">
                <div className="mb-5">
                    <span className="text-xl text-base-900">대시보드 로딩 중...</span>
                </div>
                <div>
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            </div>
        );
    }

    return (
        <main className="h-auto min-h-screen p-4 pt-20 md:ml-64 bg-base-200">
            <DashboardSummaryCards/>
            <div className="mb-4 grid grid-cols-2 gap-4">
                {/* 다가오는 일정 (항목 최대 3개) */}
                <DashboardUpcomingSchedule/>

                {/* 최근 결재 현황 (항목 최대 3개) */}
                <DashboardRecentApprovalHistory/>
            </div>

            <div className="mb-2 grid grid-cols-3 gap-4">
                {/* 최근 활동 (항목 최대 3개) */}
                <DashboardRecentActivities/>
                {/* 출퇴근 카드 */}
                <WorkCheckCardGrid
                    workTimeLogs={workTimeLogs}
                    workTimeTypes={workTimeTypes}
                    hasCheckedIn={hasCheckedIn}
                    hasCheckedOut={hasCheckedOut}
                    handleCheck={handleCheck}
                />
                {/* 근무현황 */}
                <WorkStatusPanel
                    workTimeLogs={workTimeLogs.daily}
                    workTimeTypes={workTimeTypes}
                />
            </div>
        </main>
    );
}
