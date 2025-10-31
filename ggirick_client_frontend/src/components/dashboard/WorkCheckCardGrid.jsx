import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Card } from "flowbite-react";
import Clock from "@/components/dashboard/Clock.jsx";

export default function WorkCheckCardGrid({
                                              workTimeLogs = { daily: [] },
                                              workTimeTypes = [],
                                              hasCheckedIn,
                                              hasCheckedOut,
                                              handleCheck,
                                          }) {
    // ✅ 출근 / 퇴근 로그 추출
    const latestIn = useMemo(() => {
        const inLog = [...(workTimeLogs.daily || [])]
            .filter((log) => log.type === "IN")
            .sort((a, b) => dayjs(b.recordedAt).diff(dayjs(a.recordedAt)))[0];
        return inLog ? dayjs(inLog.recordedAt).format("HH:mm:ss") : "--:--:--";
    }, [workTimeLogs]);

    const latestOut = useMemo(() => {
        const outLog = [...(workTimeLogs.daily || [])]
            .filter((log) => log.type === "OUT")
            .sort((a, b) => dayjs(b.recordedAt).diff(dayjs(a.recordedAt)))[0];
        return outLog ? dayjs(outLog.recordedAt).format("HH:mm:ss") : "--:--:--";
    }, [workTimeLogs]);

    // 버튼 비활성화 조건 함수
    const isDisabled = (type) => {
        if (type === "IN") return hasCheckedIn || hasCheckedOut;
        if (type === "OUT") return !hasCheckedIn || hasCheckedOut;
        return !hasCheckedIn || hasCheckedOut;
    };

    return (
        <div className="h-32 rounded-lg md:h-72">
            <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
                <div className="flex items-start justify-start">
                    <div className="flex w-full flex-col gap-4">
                        {/* 헤더 */}
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-clipboard-clock text-base-content-800 h-6 w-6"
                            >
                                <path d="M16 14v2.2l1.6 1" />
                                <path d="M16 4h2a2 2 0 0 1 2 2v.832" />
                                <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
                                <circle cx="16" cy="16" r="6" />
                                <rect x="8" y="2" width="8" height="4" rx="1" />
                            </svg>
                            <span className="text-m text-base-content-900">출/퇴근 기록</span>
                        </div>

                        {/* 본문 */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* 시계 */}
                            <div className="flex items-center justify-center">
                                <Clock />
                            </div>

                            {/* 버튼 카드 그룹 */}
                            <div className="inline-grid grid-cols-2 gap-2">
                                <div className="col-span-2"></div>

                                {/* 근무유형 렌더링 */}
                                {workTimeTypes
                                    .filter((t) => !["LEAVE"].includes(t.type))
                                    .map((t) => (
                                        <Card
                                            key={t.type}
                                            onClick={() => !isDisabled(t.type) && handleCheck(t.type)}
                                            className={`${
                                                ["IN", "OUT"].includes(t.type) ? "h-24" : "h-12"
                                            } w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800 ${
                                                isDisabled(t.type)
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            {t.name}
                                            {["IN", "OUT"].includes(t.type) && (
                                                <>
                                                    <br />
                                                    <span className="text-sm">
                            {t.type === "IN" ? latestIn : latestOut}
                          </span>
                                                </>
                                            )}
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
