import dayjs from "dayjs";

// 공통 포맷 함수
export const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

// 기간 계산 함수들
// 연간
export const getYearRange = () => ({
    start: formatDate(dayjs().startOf("year")),
    end: formatDate(dayjs().endOf("year")),
});

// 주간
export const getWeekRange = (baseDate = dayjs()) => {
    const start = baseDate.startOf("week").add(1, "day"); // 월요일 시작 기준
    const end = start.add(6, "day");
    return {
        start: formatDate(start),
        end: formatDate(end),
    };
};

// 월간
export const getMonthRange = (baseDate = dayjs()) => ({
    start: formatDate(baseDate.startOf("month")),
    end: formatDate(baseDate.endOf("month")),
});

// 일간
export const getDayRange = (baseDate = dayjs()) => {
    const formatted = formatDate(baseDate);
    return { start: formatted, end: formatted };
};