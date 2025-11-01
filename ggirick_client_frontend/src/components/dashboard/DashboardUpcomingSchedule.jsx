import {Card} from "flowbite-react";
import {timestampToMonthDay} from "@/utils/common/dateFormat.js";
import useDashboardStore from "@/store/dashboard/useDashboardStore.js";
import {useNavigate} from "react-router-dom";
import useCalendarGroup from "@/hooks/calendar/useCalendarGroup.js";

export default function DashboardUpcomingSchedule() {
    const navigate = useNavigate();

    const calendarList = useDashboardStore(state => state.calendarList);

    // 일정 그룹 이름
    const calendarGroupName = useCalendarGroup();

    return (
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
                                        <div className="flex items-center gap-1 min-w-0">
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
                                        ) : (
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
                        className="mt-auto h-8 w-full rounded-lg border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800 cursor-pointer"
                    >
                        전체 일정 보기
                    </button>
                </div>
            </Card>
        </div>
    );
}