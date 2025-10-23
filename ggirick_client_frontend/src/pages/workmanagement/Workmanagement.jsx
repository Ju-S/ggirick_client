import { useEffect, useRef, useState } from "react";
import useWorkTimeLogStore from "../../store/employee/workTimeLogStore.js";
import {getWorkTimeLogByPeriodAPI} from "@/api/workmanagement/workmanagementAPI.js";

export default function WorkDashboard() {
    const [time, setTime] = useState("");
    // 이번주 시작일
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    const [groupedStatus, setGroupedStatus] = useState([]);
    // workTimeLog 근무 현황 저장 스토어
    const { logs, setLogs } = useWorkTimeLogStore();
    // 정확한 시계
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = `${now
                .getHours()
                .toString()
                .padStart(2, "0")} : ${now
                .getMinutes()
                .toString()
                .padStart(2, "0")} : ${now
                .getSeconds()
                .toString()
                .padStart(2, "0")}`;
            setTime(formatted);
            const delay = 1000 - (now.getMilliseconds() % 1000);
            timer = setTimeout(updateTime, delay);
        };
        let timer = setTimeout(updateTime, 0);
        return () => clearTimeout(timer);
    }, []);

    // 미니 달력용
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const day = dayNames[today.getDay()];

    const listRef = useRef(null);
    const handleCheck = (type) => setStatus(type);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [logs]);

    // ✅ 주간의 시작일 계산 함수
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 = 일요일
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일 기준
        return new Date(d.setDate(diff));
    }

    // ✅ 주간 변경 버튼 클릭 시
    const changeWeek = (offset) => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() + offset * 7);
        setCurrentWeekStart(newWeekStart);
    };

    // ✅ 주간 날짜 배열 만들기
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        return date;
    });

    // ✅ 주간 근무현황 API 호출
    useEffect(() => {
        const fetchWeeklyLogs = async () => {
            const startDate = currentWeekStart.toISOString().split("T")[0];
            const endDate = new Date(currentWeekStart.getTime() + 6 * 86400000)
                .toISOString()
                .split("T")[0];

            try {
                const data = await getWorkTimeLogByPeriodAPI(startDate, endDate);
                setGroupedStatus(data);
            } catch (err) {
                console.error("근무현황 조회 실패:", err);
            }
        };

        fetchWeeklyLogs();
    }, [currentWeekStart]);

    return (
        <div className="flex">
            <main className="flex-1 h-screen overflow-y-scroll p-6 pt-24 md:ml-64 bg-base-200 text-base-content space-y-10">
                {/* 💼 올해 근무 정보 */}
                <h1 className="text-2xl font-bold mb-4">올해 근무 정보</h1>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 근태 현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base border-b-1 pb-3">근태 현황</h3>
                                <div className="grid grid-cols-4 text-center text-sm divide-x divide-base-300">
                                    {["지각", "조퇴", "퇴근누락", "결근"].map((label) => (
                                        <div key={label}>
                                            <p className="font-bold text-lg">0</p>
                                            <p className="opacity-80">{label}</p>
                                        </div>
                                    ))}
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
                                        <p className="text-3xl font-bold text-primary">16일</p>
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
                                    <div><p className="text-2xl font-bold text-primary">0일</p><p>근무일수</p></div>
                                    <div><p className="text-2xl font-bold text-success">0시간</p><p>총근무</p></div>
                                    <div><p className="text-2xl font-bold text-info">0시간</p><p>평균근무</p></div>
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
                                <div className="bg-base-200 rounded-lg px-8 py-4 border border-base-300 w-fit mx-auto mb-4">
                                    <div className="text-sm font-semibold opacity-70">{month}월</div>
                                    <div className="text-4xl font-bold text-primary my-1">{date}</div>
                                    <div className="text-sm opacity-70">{day}요일</div>
                                </div>
                                <p className="text-lg font-semibold">9시 출근</p>
                                <p className="text-sm opacity-70">09:00 ~ 18:00 (소정 8시간)</p>
                            </div>
                        </div>

                        {/* 근무체크 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body text-center">
                                <h3 className="font-semibold text-base mb-4">근무체크</h3>
                                <div className="text-5xl font-bold text-primary mb-3">{time}</div>
                                <div className="flex justify-center gap-4 mb-4">
                                    <button className="btn btn-soft btn-primary text-primary hover:text-white" onClick={() => handleCheck("출근")}>출근하기</button>
                                    <button className="btn btn-soft btn-secondary text-secondary hover:text-white" onClick={() => handleCheck("퇴근")}>퇴근하기</button>
                                </div>
                            </div>
                        </div>

                        {/* 근무현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base mb-3">근무현황</h3>
                                <div ref={listRef} className="max-h-48 overflow-y-auto rounded-md p-4">
                                    {logs.length > 0 ? (
                                        <ul className="relative flex flex-col gap-3 pl-5">
                                            {logs.map((s, i) => (
                                                <li key={i} className="relative flex items-center text-xs text-base-content">
                                                    {i < logs.length - 1 && <div className="absolute left-[0.3rem] top-3 w-[1px] h-full bg-base-300"></div>}
                                                    <div className={`w-2 h-2 rounded-full z-10 mr-2 ${i === logs.length - 1 ? "bg-primary animate-pulse" : "bg-base-300"}`}></div>
                                                    <div className="flex justify-between w-full">
                                                        <span className="text-sm opacity-70">{s.time}</span>
                                                        <span className="font-semibold">{s.type}</span>
                                                    </div>
                                                </li>
                                            ))}
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
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <button className="btn btn-ghost btn-sm" onClick={() => changeWeek(-1)}>◀</button>
                                    <h3 className="font-semibold">
                                        {`${currentWeekStart.getFullYear()}년 ${currentWeekStart.getMonth() + 1}월 ${currentWeekStart.getDate()}일 ~ ${new Date(currentWeekStart.getTime() + 6 * 86400000).getDate()}일`}
                                    </h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => changeWeek(1)}>▶</button>
                                </div>
                                <button className="btn btn-outline btn-sm" onClick={() => setCurrentWeekStart(getStartOfWeek(new Date()))}>이번 주</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full text-center text-sm">
                                    <thead className="bg-base-300">
                                    <tr>{days.map((d) => <th key={d}>{`${d.getDate()} (${dayNames[d.getDay()]})`}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        {groupedStatus.map(({ date, records }) => (
                                            <td key={date}>
                                                {records.length > 0 ? (
                                                    <ul className="text-xs space-y-1">
                                                        {records.map((r, i) => (
                                                            <li key={i} className="flex justify-between">
                                                                <span>{r.time}</span>
                                                                <span className="font-medium">{r.type}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : <p className="text-gray-400">-</p>}
                                            </td>
                                        ))}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📅 월간 근무현황 */}
                <h1 className="text-2xl font-bold mb-4">
                    {currentWeekStart.getFullYear()}년 {currentWeekStart.getMonth() + 1}월 근무현황
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
                                    <tr>
                                        <td className="font-semibold">소정</td>
                                        <td>176시간</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">연장, 휴일</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">총 근무</td>
                                        <td>176시간</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
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
