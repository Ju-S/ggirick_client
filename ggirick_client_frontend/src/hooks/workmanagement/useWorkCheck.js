import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import {
    getAllWorkTimeTypesAPI,
    getWorkTimeLogsByEmployeeIdAPI,
    insertAPI,
} from "@/api/workmanagement/workManagementAPI.js";

export default function useWorkCheck() {
    const { employee } = useEmployeeStore(); // ✅ 로그인 직원 정보
    const [workTimeLogs, setWorkTimeLogs] = useState({ daily: [] });
    const [workTimeTypes, setWorkTimeTypes] = useState([]);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [time, setTime] = useState(dayjs().format("HH:mm:ss"));

    // ✅ 초기 데이터 로딩
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const typeRes = await getAllWorkTimeTypesAPI();
                setWorkTimeTypes(typeRes.data || []);

                const logsRes = await getWorkTimeLogsByEmployeeIdAPI();
                const logs = logsRes.data || [];

                // ✅ 일간 구조로 감싸기 (WorkDashboard 구조 맞춤)
                setWorkTimeLogs({ daily: logs });

                const hasIn = logs.some((l) => l.type === "IN");
                const hasOut = logs.some((l) => l.type === "OUT");
                setHasCheckedIn(hasIn);
                setHasCheckedOut(hasOut);

                // ✅ 마지막 상태 표시용
                if (logs.length > 0) {
                    const latest = logs[logs.length - 1];
                    const matched = typeRes.data.find((t) => t.type === latest.type);
                    setCurrentStatus(matched ? matched.name : latest.type);
                }
            } catch (err) {
                console.error("❌ 근무 데이터 불러오기 실패", err);
            }
        };

        fetchInitialData();
    }, []);

    // ✅ 실시간 시계
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs().format("HH:mm:ss"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // ✅ 근무 체크 핸들러
    const handleCheck = async (type) => {
        try {
            const workTimeLog = {
                employeeId: employee.id, // ✅ 누락된 부분 추가
                type,
                recordedAt: dayjs().toISOString(), // ✅ WorkDashboard 구조 맞춤
            };

            // 1️⃣ DB insert
            const insertResp = await insertAPI(workTimeLog);
            const saved = insertResp.data;

            // 2️⃣ 프론트 상태 반영
            setWorkTimeLogs((prev) => ({
                daily: [...(prev.daily || []), saved],
            }));

            if (type === "IN") setHasCheckedIn(true);
            if (type === "OUT") setHasCheckedOut(true);

            // 3️⃣ 현재 상태 업데이트
            const matchedType = workTimeTypes.find((t) => t.type === type);
            setCurrentStatus(matchedType ? matchedType.name : type);
        } catch (err) {
            console.error("❌ 근무기록 저장 실패:", err);
        }
    };

    return {
        workTimeLogs,
        workTimeTypes,
        hasCheckedIn,
        hasCheckedOut,
        handleCheck,
        currentStatus,
        time,
    };
}
