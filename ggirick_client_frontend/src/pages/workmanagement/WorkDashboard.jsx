import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";

import {
    getAllWorkTimeTypesAPI,
    getlistByTypeAndPeriodAPI,
    getWorkSummaryAPI,
    getWorkTimeLogsByEmployeeIdAPI,
    insertAPI
} from "@/api/workmanagement/workManagementAPI.js";
import {getWorkPlanByPeriod} from "@/api/workmanagement/workPlanAPI.js";
import {getRemainingVacationAPI} from "@/api/workmanagement/vacationAPI.js";
import {getDayRange, getMonthRange, getWeekRange, getYearRange} from "@/utils/common/dayjsFormat.js";
import {getHolidaysByPeriod} from "@/api/common/holidayAPI.js";

import useEmployeeStore from "@/store/hr/employeeStore.js";
import WorkCheckPanel from "@/components/workmanagement/WorkCheckPanel.jsx";
import WorkStatusPanel from "@/components/workmanagement/WorkStatusPanel.jsx";

export default function WorkDashboard() {
    const {employee} = useEmployeeStore();
    const [time, setTime] = useState("");

    // 주 시작일: dayjs로 계산
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeekDayjs(dayjs()));

    const [groupedStatus, setGroupedStatus] = useState([]);
    const [workTimeTypes, setWorkTimeTypes] = useState([]);
    // 근무기록 상태변수 (일간 + 주간)
    const [workTimeLogs, setWorkTimeLogs] = useState({
        daily: [],
        weekly: [],
    });
    const [currentStatus, setCurrentStatus] = useState(null);
    const [remainingVacation, setRemainingVacation] = useState(0);

    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [holidays, setHolidays] = useState([]); // 공휴일 상태변수

    // 근무 계획 상태변수
    const [workPlan, setWorkPlan] = useState({
        daily: {},
        weekly: [],
        monthly: {totalPlannedHours: 0, workDays: 0}
    });

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
                const dailyLogs = logsResp.data;
                setWorkTimeLogs(prev => ({
                    ...prev,
                    daily: dailyLogs
                }));

                // 3. 출퇴근 상태 갱신
                const hasIn = dailyLogs.some(log => log.type === "IN");
                const hasOut = dailyLogs.some(log => log.type === "OUT");
                setHasCheckedIn(hasIn);
                setHasCheckedOut(hasOut);

                // 4. 연간 근무 요약 (초기 1회)
                const {start: startOfYear, end: endOfYear} = getYearRange();
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

                    // 상태변수에 저장
                    setWorkPlan(prev => ({
                        ...prev,
                        daily: formattedPlan
                    }));
                }
                console.log(workPlan);
            } catch (err) {
                console.error("초기 데이터 불러오기 실패 ❌", err);
            }
        };

        fetchInitialData();
    }, []);

    // 주간/월간 근무계획 + 근무기록 요약
    useEffect(() => {
        const fetchWeeklyAndMonthlySummary = async () => {
            try {
                // 1. 주간 / 월간 범위 계산
                const {start: startOfWeek, end: endOfWeek} = getWeekRange(currentWeekStart);
                const {start: startOfMonth, end: endOfMonth} = getMonthRange(currentWeekStart);

                // 2. 근무 요약 (주간 / 월간)
                const [weeklyResp, monthlyResp] = await Promise.all([
                    getWorkSummaryAPI(startOfWeek, endOfWeek),
                    getWorkSummaryAPI(startOfMonth, endOfMonth),
                ]);

                // ✅ 월 날짜 앞뒤로 7일 확장 (문자열 -> dayjs -> 문자열)
                const extendedStart = dayjs(startOfMonth).subtract(7, "day").format("YYYY-MM-DD");
                const extendedEnd = dayjs(endOfMonth).add(7, "day").format("YYYY-MM-DD");

                // 3. 월간 공휴일 불러오기
                const holidayResp = await getHolidaysByPeriod(extendedStart, extendedEnd);
                const monthHolidays = holidayResp?.data || [];

                // 상태에 반영
                setHolidays(monthHolidays);

                // 4. 근무일 계산 (주말 + 공휴일 제외)
                let workDays = 0;
                for (
                    let d = dayjs(startOfMonth);
                    d.isBefore(endOfMonth) || d.isSame(endOfMonth, "day");
                    d = d.add(1, "day")
                ) {
                    const isWeekend = [0, 6].includes(d.day());
                    const isHoliday = monthHolidays.some(
                        (h) => h.calDate === d.format("YYYY-MM-DD")
                    );
                    if (!isWeekend && !isHoliday) {
                        workDays++;
                    }
                }

                // 5. 기준근무시간 계산
                const standardHours = workDays * 8;

                // 6. 근무 요약 상태 업데이트
                setWorkSummary((prev) => ({
                    ...prev,
                    weekly: weeklyResp?.data || prev.weekly,
                    monthly: {
                        ...monthlyResp?.data,
                        workDays,
                        standardHours, // ✅ 추가
                    },
                }));

                // 7. 근무계획 (주간 / 월간)
                const [weeklyPlanResp, monthPlanResp] = await Promise.all([
                    getWorkPlanByPeriod(startOfWeek, endOfWeek),
                    getWorkPlanByPeriod(startOfMonth, endOfMonth),
                ]);

                // 8. 주간 근무기록 (출근/퇴근만)
                const [inLogsResp, outLogsResp] = await Promise.all([
                    getlistByTypeAndPeriodAPI(startOfWeek, endOfWeek, "IN"),
                    getlistByTypeAndPeriodAPI(startOfWeek, endOfWeek, "OUT"),
                ]);

                const weeklyLogs = [
                    ...(inLogsResp.data || []),
                    ...(outLogsResp.data || []),
                ].map((log) => ({
                    ...log,
                    date: dayjs(log.recordedAt).format("YYYY-MM-DD"),
                    time: dayjs(log.recordedAt).format("HH:mm"),
                }));

                setWorkTimeLogs((prev) => ({
                    ...prev,
                    weekly: weeklyLogs,
                }));

                // 9. 주간 계획 포맷
                const formattedWeekly = (weeklyPlanResp.data || []).map((p) => ({
                    ...p,
                    planDate: dayjs(p.planDate).format("YYYY-MM-DD"),
                    startTime: dayjs(p.startDateTime).format("HH:mm"),
                    endTime: dayjs(p.endDateTime).format("HH:mm"),
                    diffHours: dayjs(p.endDateTime)
                        .diff(dayjs(p.startDateTime), "hour", true)
                        .toFixed(1),
                }));

                // 10. 월간 계획 요약
                const formattedMonthly = (() => {
                    const data = monthPlanResp.data || [];
                    const totalHours = data.reduce((sum, p) => {
                        const hours =
                            dayjs(p.endDateTime).diff(dayjs(p.startDateTime), "hour", true) - 1;
                        return sum + hours;
                    }, 0);
                    return {
                        totalPlannedHours: totalHours.toFixed(1),
                        workDays: data.length,
                    };
                })();

                setWorkPlan((prev) => ({
                    ...prev,
                    weekly: formattedWeekly,
                    monthly: formattedMonthly,
                }));

                // 디버깅용
                console.log("공휴일(월간):", monthHolidays);
                console.log("월간 기준근무:", {workDays, standardHours});

            } catch (err) {
                console.error("❌ 주간/월간 근무 요약 불러오기 실패:", err);
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
    }, [workTimeLogs.daily]);

    // 가장 마지막 근무 상태 뱃지에 반영
    useEffect(() => {
        if (workTimeLogs.length > 0) {
            const latest = workTimeLogs[workTimeLogs.length - 1];
            const matchedType = workTimeTypes.find(t => t.type === latest.type);
            setCurrentStatus(matchedType ? matchedType.name : "알 수 없음");
        } else {
            setCurrentStatus(null);
        }
    }, [workTimeLogs.daily, workTimeTypes]);

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
        if (!workTimeLogs.daily || workTimeLogs.daily.length === 0) return;

        // daily 배열 기준으로 가져와야 함
        const latestLog = workTimeLogs.daily[workTimeLogs.daily.length - 1];
        const latestDate = dayjs(latestLog?.recordedAt);
        const now = dayjs();

        // 날짜 바뀌었는지 체크
        const crossedMidnight = now.diff(latestDate, "day") >= 1;

        // 오전 5시 이후면 초기화
        const afterResetTime = now.hour() >= 5;

        // 날짜가 바뀌었고 2시 30분 이후면 근무상태 초기화
        if (crossedMidnight && afterResetTime) {
            setHasCheckedIn(false);
            setHasCheckedOut(false);
        }
    }, [workTimeLogs.daily]);

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

            // 1. DB에 insert 요청
            const insertResp = await insertAPI(workTimeLog);
            const saved = insertResp.data; // {id, employeeId, type, recordedAt}

            // 2. type 한글 변환
            const matchedType = workTimeTypes.find((t) => t.type === saved.type);
            const typeName = matchedType ? matchedType.name : saved.type;

            // 3. 시간 포맷(dayjs)
            const formattedTime = dayjs((saved.recordedAt || "").replace(" ", "T")).format("HH:mm");

            // ️4. 프론트 상태 반영 (daily에만 추가)
            setWorkTimeLogs((prev) => ({
                ...prev,
                daily: [
                    ...(prev.daily || []),
                    {
                        ...saved,
                        time: formattedTime, // 리스트 표시용
                    },
                ],
            }));

            // 5. 상태 업데이트
            if (type === "IN") setHasCheckedIn(true);
            if (type === "OUT") setHasCheckedOut(true);

            // 6. 토스트 메시지
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

    // 주간 날짜 배열
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
                                    <div><p
                                        className="text-2xl font-bold text-primary">{workSummary.annual.workDays}일</p>
                                        <p>근무일수</p></div>
                                    <div><p
                                        className="text-2xl font-bold text-primary">{workSummary.annual.totalHours}시간</p>
                                        <p>총근무</p></div>
                                    <div><p
                                        className="text-2xl font-bold text-primary">{workSummary.annual.avgHours}시간</p>
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
                                    {workPlan?.daily.startDateTime
                                        ? `${Number(workPlan.daily.startDateTime.split(":")[0])}시 출근`
                                        : "출근 계획 없음"}
                                </p>
                                <p className="text-sm opacity-70">
                                    {workPlan?.daily.startDateTime && workPlan?.daily.endDateTime ? (
                                        <>
                                            {workPlan.daily.startDateTime} ~ {workPlan.daily.endDateTime}
                                            {" "}
                                            (소정 {workPlan.daily.diffHours - 1}시간)
                                        </>
                                    ) : (
                                        "근무 계획 없음"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* 근무체크 */}
                        <WorkCheckPanel
                            time={time}
                            workTimeTypes={workTimeTypes}
                            hasCheckedIn={hasCheckedIn}
                            hasCheckedOut={hasCheckedOut}
                            currentStatus={currentStatus}
                            handleCheck={handleCheck}
                        />

                        {/* ✅ 근무현황 */}
                        <WorkStatusPanel
                            workTimeLogs={workTimeLogs.daily}
                            workTimeTypes={workTimeTypes}
                        />
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
                                        {days.map((d) => {
                                            const dateStr = d.format("YYYY-MM-DD");

                                            // ✅ 주말 / 공휴일 판단
                                            const isWeekend = [0, 6].includes(d.day());
                                            const holiday = holidays.find(h => h.calDate === dateStr);

                                            // ✅ 주말 or 공휴일이면 빨간색 표시
                                            const isHoliday = isWeekend || holiday;

                                            return (
                                                <th key={dateStr}
                                                    className={isHoliday ? "text-error font-semibold" : ""}>
                                                    {`${d.date()} (${dayNames[d.day()]})`}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        {days.map((d) => {
                                            const dateStr = d.format("YYYY-MM-DD");

                                            // ✅ 주말 / 공휴일 체크
                                            const isWeekend = [0, 6].includes(d.day());
                                            const holiday = holidays?.find(h =>
                                                dayjs(h.calDate).isSame(d, "day")
                                            );

                                            const isHoliday = isWeekend || holiday;

                                            // ✅ 근무 계획
                                            const plan = workPlan.weekly?.find(p => p.planDate === dateStr);

                                            // ✅ 근무 기록 (IN/OUT만 표시)
                                            const dayLogs = workTimeLogs.weekly.filter(l => l.date === dateStr);
                                            const inLog = dayLogs.find(l => l.type === "IN");
                                            const outLog = dayLogs.find(l => l.type === "OUT");

                                            // ✅ 표시할 시간
                                            let startTime = plan ? plan.startTime : null;
                                            let endTime = plan ? plan.endTime : null;
                                            let label = plan ? "계획" : "";

                                            // ✅ 기록이 있으면 계획 덮어쓰기
                                            if (inLog || outLog) {
                                                startTime = inLog ? dayjs(inLog.recordedAt).format("HH:mm") : startTime;
                                                endTime = outLog ? dayjs(outLog.recordedAt).format("HH:mm") : endTime;
                                                label = "";
                                            }

                                            // ✅ 휴일명
                                            let holidayLabel = null;
                                            if (holiday) holidayLabel = holiday.description;
                                            else if (isWeekend) holidayLabel = "공휴일";

                                            return (
                                                <td key={dateStr} className="align-top p-2">
                                                    <div className="flex flex-col items-center gap-1">
                                                        {/* 🔹 휴일 */}
                                                        {isHoliday ? (
                                                            <span className="text-xs font-semibold text-error mt-1">
                                                                {holidayLabel}
                                                            </span>
                                                        ) : (
                                                            <>
                                                                {/* 🔹 출근 / 퇴근 */}
                                                                {inLog?.recordedAt && (
                                                                    <span className="text-primary font-medium text-sm">
                                                                        출근 : {dayjs(inLog.recordedAt).format("HH:mm")}
                                                                      </span>
                                                                )}

                                                                {outLog?.recordedAt && (
                                                                    <span className="text-error font-medium text-sm">
                                                                        퇴근 : {dayjs(outLog.recordedAt).format("HH:mm")}
                                                                      </span>
                                                                )}

                                                                {/* 🔹 계획 시간 (기록 없을 때만) */}
                                                                {!inLog && !outLog && plan && (
                                                                    <span className="text-gray-500 font-medium">
                                        {startTime} ~ {endTime}
                                    </span>
                                                                )}

                                                                {/* 🔹 상태 라벨 */}
                                                                {label && !isHoliday && (
                                                                    <span
                                                                        className="text-xs text-gray-400">{label}</span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
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
                                        <td>{workSummary.monthly.standardHours ?? 0}시간</td>
                                        {/* 계획 — WorkPlan의 월간 합계 사용 */}
                                        <td>{Math.round(workPlan.monthly?.totalPlannedHours ?? 0)}시간</td>
                                        {/* 실근무 — 8시간 초과 시 8로 제한 */}
                                        <td>
                                            {Math.min(
                                                workSummary.monthly.totalHours ?? 0,
                                                (workSummary.monthly.workDays ?? 0) * 8
                                            )}
                                            시간
                                        </td>
                                        {/* 연월차 */}
                                        <td>{workSummary.monthly.leaveHours ?? 0}시간</td>
                                        {/* 모든 휴가 (소수점 제거) */}
                                        <td>
                                            {(workSummary.monthly.leaveHours ?? 0) +
                                                (workSummary.monthly.overtimeHours ?? 0)}시간
                                        </td>
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
                                        <td>{(workSummary.monthly.workDays ?? 0) * 8}시간</td>
                                        <td>{Math.round(workPlan.monthly?.totalPlannedHours ?? 0)}시간</td>
                                        <td>{workSummary.monthly.totalHours ?? 0}시간</td>
                                        <td>{workSummary.monthly.leaveHours ?? 0}시간</td>
                                        <td>
                                            {(workSummary.monthly.leaveHours ?? 0) + (workSummary.monthly.overtimeHours ?? 0)}시간
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
