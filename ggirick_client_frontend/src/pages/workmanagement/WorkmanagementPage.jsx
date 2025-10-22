import { useState, useEffect } from "react";

export default function WorkDashboard() {
    const [time, setTime] = useState("11:38:53");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formatted = `${now.getHours().toString().padStart(2, "0")}시 ${now
                .getMinutes()
                .toString()
                .padStart(2, "0")}분 ${now
                .getSeconds()
                .toString()
                .padStart(2, "0")}초`;
            setTime(formatted);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const day = dayNames[today.getDay()];

    return (
        <div className="flex">
            {/* 오른쪽 콘텐츠 */}
            <main className="flex-1 h-screen overflow-y-scroll p-6 pt-24 md:ml-64 bg-base-200 text-base-content space-y-10">
                {/* 제목 */}
                <h1 className="text-2xl font-bold mb-5">근무/휴가 대시보드</h1>

                {/* 올해 근무 정보 */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 근태 현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base mb-2 border-b-1 pb-2">근태 현황</h3>
                                <div className="grid grid-cols-4 text-center text-sm divide-x divide-base-300">
                                    <div>
                                        <p className="font-bold text-lg">0</p>
                                        <p>지각</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">0</p>
                                        <p>조퇴</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">0</p>
                                        <p>퇴근누락</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">0</p>
                                        <p>결근</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 휴가 현황 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold text-base mb-2 border-b-1 pb-2">휴가 현황</h3>
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
                                <h3 className="font-semibold text-base mb-2 border-b-1 pb-2">근무시간</h3>
                                <div className="grid grid-cols-3 text-center text-sm">
                                    <div><p className="font-bold text-lg">0일</p><p>근무일수</p></div>
                                    <div><p className="font-bold text-lg">0시간</p><p>총근무</p></div>
                                    <div><p className="font-bold text-lg">0시간</p><p>평균근무</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 오늘 근무현황 */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 근무계획 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body items-center text-center">
                                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">event</span>
                                    근무계획
                                </h3>

                                {/* 오늘 날짜 미니 캘린더 */}
                                <div className="bg-base-200 rounded-lg px-8 py-4 border border-base-300 w-fit mx-auto mb-4">
                                    <div className="text-sm font-semibold text-gray-500">{month}월</div>
                                    <div className="text-4xl font-bold text-primary my-1">{date}</div>
                                    <div className="text-sm text-gray-600">{day}요일</div>
                                </div>

                                <div className="mt-2 space-y-1">
                                    <p className="text-lg font-semibold">9시 출근</p>
                                    <p className="text-sm opacity-70">09:00 ~ 18:00 (소정 8시간)</p>
                                </div>

                                <div className="flex justify-center gap-2 mt-4">
                                    <button className="btn btn-link text-primary text-sm">내 근무 계획</button>
                                    <button className="btn btn-outline btn-sm">연장근무신청</button>
                                    <button className="btn btn-outline btn-sm">휴(무)일근무신청</button>
                                </div>
                            </div>
                        </div>

                        {/* 근무체크 */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body text-center">
                                <h3 className="font-semibold text-base mb-4">근무체크</h3>
                                <div className="text-5xl font-bold text-primary mb-3">{time}</div>
                                <div className="flex justify-center gap-4 mb-4">
                                    <button className="btn btn-success text-white">출근하기</button>
                                    <button className="btn btn-error text-white">퇴근하기</button>
                                </div>
                                <div className="flex justify-center gap-2 mb-3">
                                    <button className="btn btn-outline btn-xs">업무</button>
                                    <button className="btn btn-outline btn-xs">외출</button>
                                    <button className="btn btn-outline btn-xs">회의</button>
                                </div>
                                <div className="text-sm text-left mt-3 border-t pt-3">
                                    <p>06:22 출근</p>
                                    <p>06:22 외출</p>
                                    <p>06:22 회의</p>
                                    <p>06:22 업무</p>
                                </div>
                                <div className="mt-4">
                                    <button className="btn btn-outline btn-sm">근무체크 수정</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 주간 근무현황 */}
                <section className="pb-10">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">2025년 10월 20일 ~ 26일</h3>
                                <button className="btn btn-outline btn-sm">이전 주</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full text-center text-sm">
                                    <thead className="text-sm bg-base-300">
                                    <tr>
                                        <th>날짜</th>
                                        <th>근무계획</th>
                                        <th>실근무</th>
                                        <th>비고</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr><td>10/20 (월)</td><td>09:00 ~ 18:00</td><td>-</td><td>-</td></tr>
                                    <tr><td>10/21 (화)</td><td>09:00 ~ 18:00</td><td>-</td><td>-</td></tr>
                                    <tr><td>10/22 (수)</td><td>출근 06:22</td><td>-</td><td>-</td></tr>
                                    <tr><td>10/23 (목)</td><td>09:00 ~ 18:00</td><td>-</td><td>-</td></tr>
                                    <tr><td>10/24 (금)</td><td>09:00 ~ 18:00</td><td>-</td><td>-</td></tr>
                                    <tr><td>10/25 (토)</td><td>휴무일</td><td>-</td><td>-</td></tr>
                                    <tr><td>10/26 (일)</td><td>휴일</td><td>-</td><td>-</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                <div className="border rounded-md p-4">
                                    <p>계획: <span className="font-bold">24시간</span></p>
                                    <p>휴가: <span className="font-bold">0시간</span></p>
                                </div>
                                <div className="border rounded-md p-4">
                                    <p>실근무 총합: <span className="font-bold">0시간</span></p>
                                    <p>연장/야간: <span className="font-bold">0시간</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
