import { useEffect, useRef } from "react";
import dayjs from "dayjs";

/**
 * 근무현황 패널 컴포넌트
 * @param {Array} workTimeLogs - 일간 근무기록 (daily 배열)
 * @param {Array} workTimeTypes - 근무유형 목록
 */
export default function WorkStatusPanel({ workTimeLogs = [], workTimeTypes = [] }) {
    const listRef = useRef(null);

    // 새로운 로그가 추가될 때 자동으로 맨 아래로 스크롤
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [workTimeLogs]);

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                <h3 className="font-semibold text-base mb-3">근무현황</h3>

                <div ref={listRef} className="max-h-48 overflow-y-auto rounded-md p-4">
                    {workTimeLogs.length > 0 ? (
                        <ul className="relative flex flex-col gap-3 pl-5">
                            {workTimeLogs.map((s, i) => {
                                const formattedTime = dayjs(s.recordedAt).format("HH:mm");
                                const matchedType = workTimeTypes.find((t) => t.type === s.type);
                                const typeName = matchedType ? matchedType.name : s.type;

                                return (
                                    <li
                                        key={i}
                                        className="relative flex items-center text-xs text-base-content"
                                    >
                                        {i < workTimeLogs.length - 1 && (
                                            <div className="absolute left-[0.3rem] top-3 w-[1px] h-full bg-base-300"></div>
                                        )}
                                        <div
                                            className={`w-2 h-2 rounded-full z-10 mr-2 ${
                                                i === workTimeLogs.length - 1
                                                    ? "bg-primary animate-pulse"
                                                    : "bg-base-300"
                                            }`}
                                        ></div>
                                        <div className="flex justify-between w-full">
                                            <span className="text-sm opacity-70">{formattedTime}</span>

                                            {s.type === "IN" ? (
                                                <span className="badge badge-soft badge-primary font-semibold">
                          {typeName}
                        </span>
                                            ) : s.type === "OUT" ? (
                                                <span className="badge badge-soft badge-error font-semibold">
                          {typeName}
                        </span>
                                            ) : (
                                                <span className="badge badge-outline font-semibold">
                          {typeName}
                        </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-2">
                            아직 근무 기록이 없습니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
