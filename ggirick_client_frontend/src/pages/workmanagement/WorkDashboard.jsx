import {useEffect, useRef, useState} from "react";
import {
    getAllWorkTimeTypesAPI,
    getWorkSummaryAPI,
    getWorkTimeLogsByEmployeeIdAPI,
    insertAPI
} from "@/api/workmanagement/workManagementAPI.js";
import {getWorkPlanByPeriod} from "@/api/workmanagement/workPlanAPI.js";
import {getRemainingVacationAPI} from "@/api/workmanagement/vacationAPI.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import dayjs from "dayjs";
import {getDayRange, getMonthRange, getWeekRange, getYearRange} from "@/utils/common/dayjsFormat.js";

export default function WorkDashboard() {
    const {employee} = useEmployeeStore();
    const [time, setTime] = useState("");

    // 주 시작일: dayjs로 계산
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeekDayjs(dayjs()));

    const [groupedStatus, setGroupedStatus] = useState([]);
    const [workTimeTypes, setWorkTimeTypes] = useState([]);
    const [workTimeLogs, setWorkTimeLogs] = useState([]);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [remainingVacation, setRemainingVacation] = useState(0);

    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // 근무 계획 상태변수 - 일간
    const [workPlan, setWorkPlan] = useState();

    // 근무 기록 통계용 상태변수 - 연간/월간/주간
    const [workSummary, setWorkSummary] = useState({
        annual: {
            workDays: 0,
            totalHours: 0,
            avgHours: 0,
            overtimeHours: 0,
            nightHours: 0,
            leaveHours: 0,
        },
        monthly: {
            workDays: 0,
            totalHours: 0,
            avgHours: 0,
            overtimeHours: 0,
            nightHours: 0,
            leaveHours: 0,
            plannedHours: 0,
            totalPlannedHours: 0
        },
        weekly: {
            workDays: 0,
            totalHours: 0,
            avgHours: 0,
            overtimeHours: 0,
            nightHours: 0,
            leaveHours: 0,
            plannedHours: 0,
            totalPlannedHours: 0
        },
        daily: {
            workDays: 0,
            totalHours: 0,
            avgHours: 0,
            overtimeHours: 0,
            nightHours: 0,
            leaveHours: 0,
            plannedHours: 0,
            totalPlannedHours: 0
        },
    });

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(""), 2000);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. 근무유형 목록
                const workTimeTypesResp = await getAllWorkTimeTypesAPI();
                setWorkTimeTypes(workTimeTypesResp.data);

                // 2. 내 근무기록
                const logsResp = await getWorkTimeLogsByEmployeeIdAPI();
                const logs = logsResp.data;
                setWorkTimeLogs(logs);

                // 3. 출퇴근 상태 갱신
                const hasIn = logs.some(log => log.type === "IN");
                const hasOut = logs.some(log => log.type === "OUT");
                setHasCheckedIn(hasIn);
                setHasCheckedOut(hasOut);

                // 4. 연간 근무 요약 (초기 1회)
                const { start: startOfYear, end: endOfYear } = getYearRange();
                const annualResp = await getWorkSummaryAPI(startOfYear, endOfYear);

                if (annualResp?.data) {
                    setWorkSummary(prev => ({
                        ...prev,
                        annual: annualResp.data
                    }));
                }

                // 5. 오늘 근무 계획 불러오기
                const {start: startOfDay, end: endOfDay} = getDayRange();
                const dailyResp = await getWorkPlanByPeriod(startOfDay, endOfDay);

                if (dailyResp?.data?.length) {
                    const plan = dailyResp.data[0];

                    // ✅ 포맷해서 저장 (예: 'HH:mm' 형식)
                    const formattedPlan = {
                        ...plan,
                        startDateTime: dayjs(plan.startDateTime).format("HH:mm"),
                        endDateTime: dayjs(plan.endDateTime).format("HH:mm"),
                        diffHours: dayjs(plan.endDateTime).diff(dayjs(plan.startDateTime), "hour", true).toFixed(1),
                    };

                    setWorkPlan(formattedPlan);
                }
                console.log(workPlan);
            } catch (err) {
                console.error("초기 데이터 불러오기 실패 ❌", err);
            }
        };

        fetchInitialData();
    }, []);

    // 주간/월간 계획 + 기록 요약 (currentWeekStart 변경 시마다 호출)
    useEffect(() => {
        const fetchWeeklyAndMonthlySummary = async () => {
            try {
                // 주간 / 월간 범위 계산
                const { start: startOfWeek, end: endOfWeek } = getWeekRange(currentWeekStart);
                const { start: startOfMonth, end: endOfMonth } = getMonthRange(currentWeekStart);
                console.log(startOfWeek, endOfWeek, startOfMonth, endOfMonth);

                // 주간 / 월간 근무기록 가져오기
                const weeklyResp = await getWorkSummaryAPI(startOfWeek, endOfWeek);
                const monthlyResp = await getWorkSummaryAPI(startOfMonth, endOfMonth);

                // 상태변수에 저장
                setWorkSummary(prev => ({
                    ...prev,
                    weekly: (weeklyResp?.data || prev.weekly),
                    monthly: (monthlyResp?.data || prev.monthly)
                }));

                // 주간 / 월간 근무계획 가져오기
                const weeklyPlanResp = await getWorkPlanByPeriod(startOfWeek, endOfWeek);
                const monthPlanResp = await getWorkPlanByPeriod(startOfMonth, endOfMonth);

                // 상태변수에 저장
                setWorkPlan(prev => ({
                    ...prev,
                    weekly: weeklyPlanResp.data,
                    monthly: monthPlanResp.data
                }))
                console.log(workSummary);
                console.log(workPlan);
            } catch (err) {
                console.error("주간/월간 근무 요약 불러오기 실패 ❌", err);
            }
        };

        fetchWeeklyAndMonthlySummary();
    }, [currentWeekStart]);

    // 잔여휴가
    useEffect(() => {
        const fetchVacation = async () => {
            try {
                const remaining = await getRemainingVacationAPI();
                setRemainingVacation(remaining.data);
            } catch (err) {
                console.error("잔여휴가 불러오기 실패 ❌", err);
            }
        };
        fetchVacation();
    }, []);

    // 근무현황 자동 스크롤
    const listRef = useRef(null);
    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [workTimeLogs]);

    // 가장 마지막 근무 상태 뱃지에 반영
    useEffect(() => {
        if (workTimeLogs.length > 0) {
            const latest = workTimeLogs[workTimeLogs.length - 1];
            const matchedType = workTimeTypes.find(t => t.type === latest.type);
            setCurrentStatus(matchedType ? matchedType.name : "알 수 없음");
        } else {
            setCurrentStatus(null);
        }
    }, [workTimeLogs, workTimeTypes]);

    // 실시간 시계(dayjs)
    useEffect(() => {
        const updateTime = () => {
            const now = dayjs();
            setTime(now.format("HH : mm : ss"));
            const delay = 1000 - now.millisecond();
            timer = setTimeout(updateTime, delay);
        };
        let timer = setTimeout(updateTime, 0);
        return () => clearTimeout(timer);
    }, []);

    // 출/퇴근 버튼 초기화 ( 오전 5시 초기화 )
    useEffect(() => {
        if (workTimeLogs.length === 0) return;

        const latestLog = workTimeLogs[workTimeLogs.length - 1];
        const latestDate = dayjs(latestLog.recordedAt);
        const now = dayjs();

        const crossedMidnight = now.diff(latestDate, "day") >= 1;
        const afterResetTime = now.hour() > 2 || (now.hour() === 2 && now.minute() >= 30);

        // 날짜가 바뀌었고 2시 30분 이후면 근무상태 초기화
        if (crossedMidnight && afterResetTime) {
            setHasCheckedIn(false);
            setHasCheckedOut(false);
        }
    }, [workTimeLogs]);

    // 미니 달력용(dayjs)
    const today = dayjs();
    const month = today.month() + 1;      // 0~11 → +1
    const date = today.date();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const day = dayNames[today.day()];    // 0(일)~6(토)

    // 근무 버튼 클릭 시 DB에 INSERT + 화면 반영
    const handleCheck = async (type) => {
        try {
            const workTimeLog = {
                type,
                // ✅ dayjs로 ISO
                recordedAt: dayjs().toISOString(),
            };

            // 1️⃣ DB에 insert 요청
            const insertResp = await insertAPI(workTimeLog);
            const saved = insertResp.data; // {id, employeeId, type, recordedAt}

            // 2️⃣ type 한글 변환
            const matchedType = workTimeTypes.find((t) => t.type === saved.type);
            const typeName = matchedType ? matchedType.name : saved.type;

            // 3️⃣ 시간 포맷(dayjs)
            const formattedTime = dayjs((saved.recordedAt || "").replace(" ", "T")).format("HH:mm");

            // 4️⃣ 프론트 상태 반영
            setWorkTimeLogs((prev) => [
                ...prev,
                {
                    ...saved,
                    time: formattedTime, // 리스트 표시용
                },
            ]);

            // 5️⃣ 상태 업데이트
            if (type === "IN") setHasCheckedIn(true);
            if (type === "OUT") setHasCheckedOut(true);

            // 6️⃣ 토스트 메시지
            showToast(`${typeName} 기록 완료`);
        } catch (err) {
            console.error("근무기록 저장 실패:", err);
        }
    };

    // 단일화된 근무 요약 API 호출 함수
    const fetchWorkSummary = async (startDate, endDate) => {
        try {
            const formattedStart = dayjs(startDate).format("YYYY-MM-DD");
            const formattedEnd = dayjs(endDate).format("YYYY-MM-DD");

            const resp = await getWorkSummaryAPI(formattedStart, formattedEnd);
            setWorkSummary(resp.data);
        } catch (err) {
            console.error("근무 요약 조회 실패 ❌", err);
        }
    };

    // 월요일 시작 기준 주 시작일
    function getStartOfWeekDayjs(d) {
        // d: dayjs 인스턴스
        const dow = d.day(); // 0:일 ~ 6:토
        const offset = (dow + 6) % 7; // 월(1) 기준으로 이전 월요일까지 뺄 일수
        return d.subtract(offset, "day").startOf("day");
    }

    // 주간 변경 버튼 클릭 시
    const changeWeek = (offset) => {
        setCurrentWeekStart(currentWeekStart.add(offset * 7, "day"));
    };

    // ✅ 주간 날짜 배열
    const days = Array.from({length: 7}, (_, i) => currentWeekStart.add(i, "day"));

    return (
        <div className="flex">
            {toastMessage && (
                <div
                    className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
                        toastMessage ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className={`alert alert-${toastMessage.color || "info"} shadow-lg`}>
                      <span className="text-white font-semibold text-sm">
                        {toastMessage.message || toastMessage}
                      </span>
                    </div>
                </div>
            )}

            <main
                className="flex-1 h-screen overflow-y-scroll p-6 pt-24 md:ml-64 bg-base-200 text-base-content space-y-10">
                {/* 💼 올해 근무 정보 */}
                <h1 className="text-2xl font-bold mb-4">올해 근무 정보</h1>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 근태 현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base border-b-1 pb-3">근태 현황</h3>
                                <div className="grid grid-cols-4 text-center text-sm divide-x divide-base-300">
                                    <div>
                                        <p className="font-bold text-lg">{workSummary.annual.lateCount ?? 0}</p>
                                        <p className="opacity-80">지각</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{workSummary.annual.earlyLeaveCount ?? 0}</p>
                                        <p className="opacity-80">조퇴</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{workSummary.annual.missingOutCount ?? 0}</p>
                                        <p className="opacity-80">퇴근누락</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{workSummary.annual.absentCount ?? 0}</p>
                                        <p className="opacity-80">결근</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 휴가 현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base mb-2 border-b-1 pb-3">휴가 현황</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-70">잔여 휴가</p>
                                        <p className="text-3xl font-bold text-primary">{remainingVacation}일</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn btn-outline btn-sm">휴가 현황</button>
                                        <button className="btn btn-primary btn-sm">휴가 신청</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 근무시간 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base mb-3 border-b-1 pb-3">근무시간</h3>
                                <div className="grid grid-cols-3 text-center text-sm divide-x divide-base-300">
                                    <div><p className="text-2xl font-bold text-primary">{workSummary.annual.workDays}일</p>
                                        <p>근무일수</p></div>
                                    <div><p className="text-2xl font-bold text-primary">{workSummary.annual.totalHours}시간</p>
                                        <p>총근무</p></div>
                                    <div><p className="text-2xl font-bold text-primary">{workSummary.annual.avgHours}시간</p>
                                        <p>평균근무</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📆 오늘 근무현황 */}
                <h1 className="text-2xl font-bold mb-4">오늘 근무 현황</h1>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 근무계획 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body items-center text-center">
                                <h3 className="font-semibold text-base mb-4">근무계획</h3>
                                <div
                                    className="bg-base-200 rounded-lg px-8 py-4 border border-base-300 w-fit mx-auto mb-4">
                                    <div className="text-sm font-semibold opacity-70">{month}월</div>
                                    <div className="text-4xl font-bold text-primary my-1">{date}</div>
                                    <div className="text-sm opacity-70">{day}요일</div>
                                </div>
                                <p className="text-lg font-semibold">
                                    {workPlan?.startDateTime
                                        ? `${Number(workPlan.startDateTime.split(":")[0])}시 출근`
                                        : "출근 계획 없음"}
                                </p>
                                <p className="text-sm opacity-70">
                                    {workPlan?.startDateTime && workPlan?.endDateTime ? (
                                        <>
                                            {workPlan.startDateTime} ~ {workPlan.endDateTime}
                                            {" "}
                                            (소정 {workPlan.diffHours}시간)
                                        </>
                                    ) : (
                                        "근무 계획 없음"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* 근무체크 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body text-center">
                                <h3 className="font-semibold text-base mb-4 flex justify-center items-center gap-2">근무체크
                                    {currentStatus && (
                                        <span
                                            className={`badge badge-soft ${
                                                currentStatus === "출근" ? "badge-primary" :
                                                    currentStatus === "퇴근" ? "badge-error" :
                                                        currentStatus === "업무" ? "badge-info" :
                                                            currentStatus === "회의" ? "badge-accent" :
                                                                currentStatus === "외근" ? "badge-warning" :
                                                                    currentStatus === "외출" ? "badge-neutral" :
                                                                        "badge-ghost"
                                            } font-semibold`}
                                        >
                                          {["출근", "퇴근"].includes(currentStatus)
                                              ? currentStatus
                                              : `${currentStatus}중`}
                                        </span>
                                    )}
                                </h3>
                                <div className="text-5xl font-bold text-primary mb-3">{time}</div>
                                <div className="flex justify-center gap-4 mb-4">
                                    <button
                                        className={`btn btn-soft btn-primary text-primary hover:text-white transition-all ${
                                            hasCheckedIn || hasCheckedOut ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onClick={() => handleCheck("IN")}
                                        disabled={hasCheckedIn || hasCheckedOut}
                                    >
                                        출근하기
                                    </button>

                                    <button
                                        className={`btn btn-soft btn-error text-error hover:text-white transition-all ${
                                            !hasCheckedIn || hasCheckedOut ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onClick={() => handleCheck("OUT")}
                                        disabled={!hasCheckedIn || hasCheckedOut}
                                    >
                                        퇴근하기
                                    </button>
                                </div>

                                {/* 그 외 근무유형 */}
                                <div className="flex justify-center gap-2 mb-3">
                                    {workTimeTypes
                                        .filter((t) => t.type !== "IN" && t.type !== "OUT" && t.type !== "LEAVE")
                                        .map((type) => (
                                            <button
                                                key={type.type}
                                                className={`btn btn-outline btn-xs transition-all ${
                                                    !hasCheckedIn || hasCheckedOut
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                onClick={() => handleCheck(type.type)}
                                                disabled={!hasCheckedIn || hasCheckedOut}
                                            >
                                                {type.name}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* 근무현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base mb-3">근무현황</h3>
                                <div ref={listRef} className="max-h-48 overflow-y-auto rounded-md p-4">
                                    {workTimeLogs.length > 0 ? (
                                        <ul className="relative flex flex-col gap-3 pl-5">
                                            {workTimeLogs.map((s, i) => {
                                                // ✅ 시간 포맷(dayjs)
                                                const formattedTime = dayjs((s.recordedAt || "").replace(" ", "T")).format("HH:mm");

                                                // workTimeTypes에서 한글 이름 찾아오기
                                                const matchedType = workTimeTypes.find((t) => t.type === s.type);
                                                const typeName = matchedType ? matchedType.name : s.type;

                                                return (
                                                    <li key={i}
                                                        className="relative flex items-center text-xs text-base-content">
                                                        {i < workTimeLogs.length - 1 && (
                                                            <div
                                                                className="absolute left-[0.3rem] top-3 w-[1px] h-full bg-base-300"></div>
                                                        )}
                                                        <div
                                                            className={`w-2 h-2 rounded-full z-10 mr-2 ${
                                                                i === workTimeLogs.length - 1 ? "bg-primary animate-pulse" : "bg-base-300"
                                                            }`}
                                                        ></div>
                                                        <div className="flex justify-between w-full">
                                                            <span className="text-sm opacity-70">{formattedTime}</span>

                                                            {/* DaisyUI 배지 색상 구분 */}
                                                            {s.type === "IN" ? (
                                                                <span
                                                                    className="badge badge-soft badge-primary font-semibold">{typeName}</span>
                                                            ) : s.type === "OUT" ? (
                                                                <span
                                                                    className="badge badge-soft badge-error font-semibold">{typeName}</span>
                                                            ) : (
                                                                <span
                                                                    className="badge badge-outline font-semibold">{typeName}</span>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : <p className="text-sm text-gray-500 text-center py-2">아직 근무 기록이 없습니다.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📊 주간 근무현황 */}
                <h1 className="text-2xl font-bold mb-4">주간 근무 현황</h1>
                <section className="pb-10 mb-0">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            {/* 상단 주간 네비게이션 */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <button className="btn btn-ghost btn-sm" onClick={() => changeWeek(-1)}>◀</button>
                                    <h3 className="font-semibold">
                                        {`${currentWeekStart.year()}년 ${currentWeekStart.month() + 1}월 ${currentWeekStart.date()}일 ~ ${currentWeekStart.add(6, "day").date()}일`}
                                    </h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => changeWeek(1)}>▶</button>
                                </div>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setCurrentWeekStart(getStartOfWeekDayjs(dayjs()))}
                                >
                                    이번 주
                                </button>
                            </div>

                            {/* 주간 테이블 */}
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full text-center text-sm">
                                    <thead className="bg-base-300">
                                    <tr>
                                        {days.map((d) => (
                                            <th key={d.toString()}>
                                                {`${d.date()} (${dayNames[d.day()]})`}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>

                                    <tbody>
                                    <tr>
                                        {days.map((d) => {
                                            const dayData = groupedStatus.find(g => g.date === d.format("YYYY-MM-DD"));
                                            return (
                                                <td key={d.toString()} className="align-top p-2">
                                                    {dayData && dayData.records.length > 0 ? (
                                                        <ul className="text-xs space-y-1">
                                                            {dayData.records.map((r, i) => (
                                                                <li key={i} className="flex justify-between">
                                                                    <span>{r.time}</span>
                                                                    <span className="font-medium">{r.type}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-400">-</p>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* ✅ 주간 합계 행 */}
                                    <tr className="bg-base-200 text-left text-sm">
                                        <td colSpan={7} className="p-4">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <div>
                                                    <h4 className="font-semibold mb-1">계획</h4>
                                                    <p>{workSummary.weekly.totalPlannedHours ?? 0}시간</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-1">휴가</h4>
                                                    <p>{workSummary.weekly.leaveHours ?? 0}시간</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-1">실근무</h4>
                                                    <p>총: {workSummary.weekly.totalHours ?? 0}시간</p>
                                                    <p>소정: {Math.min(workSummary.weekly.totalHours ?? 0,8)}시간</p>
                                                    <p>연장: {workSummary.weekly.overtimeHours ?? 0}시간</p>
                                                    <p>야간: {workSummary.weekly.nightHours ?? 0}시간</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📅 월간 근무현황 */}
                <h1 className="text-2xl font-bold mb-4">
                    {currentWeekStart.year()}년 {currentWeekStart.month() + 1}월 근무현황
                </h1>
                <section className="pb-10">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full text-center text-sm">
                                    <thead className="bg-base-300">
                                    <tr>
                                        <th>구분</th>
                                        <th>기준근무</th>
                                        <th>계획</th>
                                        <th>실근무</th>
                                        <th>연월차</th>
                                        <th>모든 휴가</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/* ✅ 소정 */}
                                    <tr>
                                        <td className="font-semibold">소정</td>
                                        {/* 기준근무 — 8시간 × 근무일수 */}
                                        <td>{(workSummary.monthly.workDays ?? 0) * 8}시간</td>
                                        {/* 계획 */}
                                        <td>{workSummary.monthly.plannedHours ?? 0}시간</td>
                                        {/* 실근무 — 8시간 초과 시 8로 제한 */}
                                        <td>
                                            {Math.min(workSummary.monthly.totalHours ?? 0, (workSummary.monthly.workDays ?? 0) * 8)}시간
                                        </td>
                                        {/* 연월차 */}
                                        <td>{workSummary.monthly.leaveHours ?? 0}시간</td>
                                        {/* 모든 휴가 */}
                                        <td>{(workSummary.monthly.leaveHours ?? 0).toFixed(1)}시간</td>
                                    </tr>

                                    {/* ✅ 연장, 휴일 */}
                                    <tr>
                                        <td className="font-semibold">연장, 휴일</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>{workSummary.monthly.overtimeHours ?? 0}시간</td>
                                        <td>{workSummary.monthly.holidayHours ?? 0}시간</td>
                                        <td>-</td>
                                    </tr>

                                    {/* ✅ 총 근무 */}
                                    <tr>
                                        <td className="font-semibold">총 근무</td>
                                        {/* 기준근무 총합 */}
                                        <td>{(workSummary.monthly.workDays ?? 0) * 8}시간</td>
                                        <td>{workSummary.monthly.plannedHours ?? 0}시간</td>
                                        <td>{workSummary.monthly.totalHours ?? 0}시간</td>
                                        <td>{workSummary.monthly.leaveHours ?? 0}시간</td>
                                        <td>
                                            {((workSummary.monthly.leaveHours ?? 0) + (workSummary.monthly.overtimeHours ?? 0)).toFixed(1)}시간
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

/**
 * ✅ 헬퍼: 월요일 시작 기준의 주 시작일(dayjs)
 *  - JS Date 버전 대신 dayjs로 통일
 */
function getStartOfWeekDayjs(d) {
    const dow = d.day();               // 0(일)~6(토)
    const offset = (dow + 6) % 7;      // 월요일까지 이전으로 이동
    return d.subtract(offset, "day").startOf("day");
}
