import {Card} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import './Dashboard.css';
import useWorkCheck from "@/hooks/workmanagement/useWorkCheck.js";
import WorkCheckCardGrid from "@/components/dashboard/WorkCheckCardGrid.jsx";
import WorkStatusPanel from "@/components/workmanagement/WorkStatusPanel.jsx";
import {useEffect, useState} from "react";
import {getInfos} from "@/api/dashboard/dashboardAPI.js";
import {timestampToMonthDay} from "@/utils/common/dateFormat.js";
import useApprovalDocType from "@/hooks/approval/useApprovalDocType.js";
import useCalendarGroup from "@/hooks/calendar/useCalendarGroup.js";

export default function Dashboard() {
    const navigate = useNavigate();
    const {
        workTimeLogs,
        workTimeTypes,
        hasCheckedIn,
        hasCheckedOut,
        handleCheck,
    } = useWorkCheck();

    // 읽지 않은 메일
    const [mailCount, setMailCount] = useState(0);
    // 오늘 일정
    const [calendarCount, setCalendarCount] = useState(0);
    // 대기중인 결재
    const [approvalCount, setApprovalCount] = useState(0);
    // 최신 공지
    const [newNotification, setNewNotification] = useState({});

    // 다가오는 일정 3개 리스트
    const [calendarList, setCalendarList] = useState([]);
    // 최근 결재 현황 3개 리스트
    const [approvalList, setApprovalList] = useState([]);
    // 최근 활동 3개
    const [newsList, setNewsList] = useState([]);

    // 결재기안 문서 종류
    const docType = useApprovalDocType();
    // 일정 그룹 이름
    const calendarGroupName = useCalendarGroup();

    useEffect(() => {
        getInfos().then(resp => {
            setCalendarCount(resp.data.todayScheduleSize || 0);
            setCalendarList(resp.data.upcomingScheduleList || []);

            setApprovalCount(resp.data.pendingApprovalCount || 0);
            setApprovalList(resp.data.recentApprovalHistory || []);

            setNewNotification(resp.data.recentNotification || {});
        })
    }, []);

    return (
        <main className="h-auto min-h-screen p-4 pt-20 md:ml-64 bg-base-200">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="h-16 rounded-lg md:h-24">
                    <Card
                        onClick={() => navigate("/mail")}
                        className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
                    >
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    읽지 않은 메일
                                </span>
                                <span className="mt-2 text-2xl text-base-content-900">
                                    {mailCount}
                                </span>
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-mail-icon lucide-mail h-6 w-6 text-info-content"
                                    >
                                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="h-16 rounded-lg md:h-24">
                    <Card
                        onClick={() => navigate("/calendar")}
                        className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
                    >
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    오늘 일정
                                </span>
                                <span className="mt-2 text-2xl text-base-content-900">
                                    {calendarCount}
                                </span>
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-calendar-icon lucide-calendar h-6 w-6 text-success-content"
                                    >
                                        <path d="M8 2v4"/>
                                        <path d="M16 2v4"/>
                                        <rect width="18" height="18" x="3" y="4" rx="2"/>
                                        <path d="M3 10h18"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="h-16 rounded-lg md:h-24">
                    <Card
                        onClick={() => navigate("/approval?box=1")}
                        className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
                    >
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    대기 중인 결재
                                </span>
                                <span className="mt-2 text-2xl text-base-content-900">
                                    {approvalCount}
                                </span>
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-signature-icon lucide-signature h-6 w-6 text-warning-content"
                                    >
                                        <path
                                            d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/>
                                        <path d="M3 21h18"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="h-16 rounded-lg md:h-24">
                    <Card
                        onClick={() => navigate(`/board/${newNotification.id}`)}
                        className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
                    >
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    최신 공지
                                </span>
                                <span className="mt-3 text-xs text-base-content-900">
                                    {newNotification.name ? (
                                        "[" + newNotification.name + "]" + newNotification.title
                                    ) : (
                                        "등록된 공지가 없습니다."
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg !bg-error/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-message-square-more-icon lucide-message-square-more h-6 w-6 text-error-content"
                                    >
                                        <path
                                            d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
                                        <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/>
                                        <path d="M8 6v8"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
                {/* 다가오는 일정 (스크롤 없음, 항목 최대 3개) */}
                <div className="h-48 rounded-lg md:h-80">
                    <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-calendar-icon text-base-content-800 h-6 w-6"
                                >
                                    <path d="M8 2v4"/>
                                    <path d="M16 2v4"/>
                                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                                    <path d="M3 10h18"/>
                                </svg>
                                <span className="text-m text-base-content-900 font-semibold">다가오는 일정</span>
                            </div>

                            {/* overflow 제거, 최대 3개만 출력 */}
                            <div className="flex flex-col gap-3">
                                {calendarList && calendarList.length > 0 ? (
                                    calendarList.slice(0, 3).map((e) => (
                                        <Card
                                            key={e.id}
                                            onClick={() => navigate(e.groupId == null ? "/calendar" : `/calendar?groupId=${e.groupId}`)}
                                            className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-200 transition cursor-pointer py-2 flex flex-col justify-between"
                                        >
                                            {/* 상단: 색상 원 + 제목 (한 줄, truncate) */}
                                            <div className="flex items-center justify-between relative">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span
                                                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                        style={{backgroundColor: e.color || "#60a5fa"}}/>
                                                    <span
                                                        className="font-medium text-base-content-900 truncate"
                                                    >
                                                        {e.title}
                                                    </span>
                                                </div>

                                                <span className="text-xs text-base-content-600 ml-2 flex-shrink-0">
                                                    {timestampToMonthDay(e.startAt)} - {timestampToMonthDay(e.endAt)}
                                                </span>
                                            </div>

                                            {/* 하단: 담당자 (한 줄) */}
                                            <span className="text-xs text-base-content-700 relative bottom-3">
                                                {e.groupId ? (
                                                    e.name + "(" + calendarGroupName.find(group => group.id === e.groupId)?.name + ")"
                                                ):(
                                                    "개인 일정"
                                                )}
                                            </span>
                                        </Card>
                                    ))
                                ) : (
                                    <div
                                        className="flex justify-center items-center h-full text-sm italic text-base-content-600">
                                        등록된 일정이 없습니다.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate("calendar")}
                                className="mt-auto h-8 w-full rounded-lg border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                            >
                                전체 일정 보기
                            </button>
                        </div>
                    </Card>
                </div>

                {/* 최근 결재 현황 (스크롤 없음, 항목 최대 3개) */}
                <div className="h-48 rounded-lg md:h-80">
                    <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-clipboard-list text-base-content-800 h-6 w-6"
                                >
                                    <path
                                        d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/>
                                    <path d="M3 21h18"/>
                                </svg>
                                <span className="text-m text-base-content-900 font-semibold">최근 결재 현황</span>
                            </div>

                            {/* overflow 제거, 최대 3개만 출력 */}
                            <div className="flex flex-col gap-3">
                                {approvalList && approvalList.length > 0 ? (
                                    approvalList.slice(0, 3).map((e) => (
                                        <Card
                                            key={e.history.id}
                                            onClick={() => navigate(`/approval/${e.approval.id}`)}
                                            className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-200 transition cursor-pointer py-2 flex flex-col justify-between"
                                        >
                                            {/* 상단: 제목 + 우측(상태 뱃지 + 문서유형) */}
                                            <div className="flex items-center justify-between relative">
                                                <span
                                                    className="font-medium text-base-content-900 truncate"
                                                    style={{maxWidth: "calc(100% - 110px)"}} // 뱃지영역 고려
                                                >
                                                    <span className="text-sm font-bold text-base mr-2">
                                                        {e.approval.name}
                                                    </span>
                                                    {e.approval.title}
                                                </span>

                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <div
                                                        className={`badge badge-sm ${
                                                            e.approval.typeId === 1
                                                                ? "bg-success/30 text-success-content"
                                                                : e.approval.typeId === 2
                                                                    ? "bg-error/30 text-error-content"
                                                                    : "bg-base-300 text-base-content-800"
                                                        }`}
                                                    >
                                                        {e.approval.typeId === 1 ? "승인" : e.history.typeId === 2 ? "반려" : "진행중"}
                                                    </div>

                                                    <div className="badge badge-sm bg-base-300">
                                                        {docType.find((t) => t.code === e.approval.docTypeCode)?.name || ""}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 하단: 결재자 + 날짜 (한 줄) */}
                                            <span className="text-xs text-base-content-700 relative bottom-3">
                                                {e.history.name} -> {e.history.typeId === 1 ? "승인" : e.history.typeId === 2 ? "반려" : "의견"} • {timestampToMonthDay(e.history.recordedAt)}
                                            </span>
                                        </Card>
                                    ))
                                ) : (
                                    <div
                                        className="flex justify-center items-center h-full text-sm italic text-base-content-600">
                                        결재 현황이 없습니다.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate("approval")}
                                className="mt-auto h-8 w-full rounded-lg border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                            >
                                전체 결재 보기
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="mb-2 grid grid-cols-3 gap-4">
                <div className="h-32 rounded-lg md:h-72">
                    <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
                        <div className="flex items-start justify-start">
                            <div className="flex w-full flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-trending-up-icon text-base-content-800 h-6 w-6"
                                    >
                                        <path d="M16 7h6v6"/>
                                        <path d="m22 7-8.5 8.5-5-5L2 17"/>
                                    </svg>
                                    <span className="text-m text-base-content-900">
                                        최근 활동
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 min-h-[200px]">
                                    {newsList && newsList.length > 0 ? (
                                        newsList.map((e) => (
                                            <Card
                                                key={e.id}
                                                onClick={() =>
                                                    navigate(`/approval/${e.approvalId}`)
                                                }
                                                className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                                            >
                                                {e.title}
                                            </Card>
                                        ))
                                    ) : (
                                        // 비어 있을 때도 높이 확보용 placeholder
                                        <div
                                            className="flex flex-col justify-center items-center h-full text-base-content">
                                            <p className="italic text-sm">최근 활동이 없습니다.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
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
