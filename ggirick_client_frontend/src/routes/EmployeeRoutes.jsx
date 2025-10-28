import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import "flowbite/dist/flowbite.css";

// Lazy 로드
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard.jsx"));
const BoardRoutes = lazy(() => import("./BoardRoutes.jsx"));
const ReservationPage = lazy(() => import("@/pages/reservation/ReservationPage.jsx"));
const TaskPage = lazy(() => import("@/pages/task/TaskPage.jsx"));
const ChatPage = lazy(() => import("@/pages/chat/ChatPage.jsx"));
const MailPage = lazy(() => import("@/pages/mail/MailPage.jsx"));
const AddressPage = lazy(() => import("@/pages/address/AddressPage.jsx"));
const ApprovalRoutes = lazy(() => import("@/routes/ApprovalRoutes.jsx"));
const CalendarPage = lazy(() => import("@/pages/calendar/CalendarPage.jsx"));
const CalendarLayout = lazy(() => import("@/pages/calendar/CalendarLayout.jsx"));

export default function EmployeeRoutes() {
    // ✨ prefetch hook
    useEffect(() => {
        // 자주 이동하는 페이지를 백그라운드에서 미리 불러옴
        import("@/pages/chat/ChatPage.jsx");
        import("@/pages/mail/MailPage.jsx");
        import("@/pages/task/TaskPage.jsx");
    }, []);

    return (
        <Suspense fallback={<div className="text-center p-4">페이지 불러오는 중...</div>}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/board/*" element={<BoardRoutes />} />
                <Route path="/approval/*" element={<ApprovalRoutes/>} />
                <Route path="/calendar" element={<CalendarLayout><CalendarPage/></CalendarLayout>} />
                <Route path="/workmanagement" element={<>workmanagement</>} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/task" element={<TaskPage />} />
                <Route path="/mail" element={<MailPage />} />
                <Route path="/address" element={<AddressPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/videomeeting" element={<>videomeeting</>} />
                <Route path="/drive" element={<>drive</>} />
                <Route path="/organization" element={<>organization</>} />
                <Route path="*" element={<>error</>} />
            </Routes>
        </Suspense>
    );
}
