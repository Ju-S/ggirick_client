import {Card} from "flowbite-react";
import useDashboardStore from "@/store/dashboard/useDashboardStore.js";
import {useNavigate} from "react-router-dom";

export default function DashboardSummaryCards() {
    const navigate = useNavigate();

    const mailCount = useDashboardStore(state => state.mailCount);
    const calendarCount = useDashboardStore(state => state.calendarCount);
    const approvalCount = useDashboardStore(state => state.approvalCount);
    const newNotification = useDashboardStore(state => state.newNotification);

    return (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-16 rounded-lg md:h-24">
                <Card
                    onClick={() => navigate("/mail")}
                    className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300 cursor-pointer"
                >
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    읽지 않은 메일
                                </span>
                            <span className="mt-2 text-2xl text-base-content-900">
                                    {mailCount}
                                </span>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/70">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-mail-icon lucide-mail h-6 w-6 text-info-content"
                                >
                                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="h-16 rounded-lg md:h-24">
                <Card
                    onClick={() => navigate("/calendar")}
                    className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300 cursor-pointer"
                >
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    오늘 일정
                                </span>
                            <span className="mt-2 text-2xl text-base-content-900">
                                    {calendarCount}
                                </span>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/70">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-calendar-icon lucide-calendar h-6 w-6 text-success-content"
                                >
                                    <path d="M8 2v4"/>
                                    <path d="M16 2v4"/>
                                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                                    <path d="M3 10h18"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="h-16 rounded-lg md:h-24">
                <Card
                    onClick={() => navigate("/approval?box=1")}
                    className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300 cursor-pointer"
                >
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    대기 중인 결재
                                </span>
                            <span className="mt-2 text-2xl text-base-content-900">
                                    {approvalCount}
                                </span>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/70">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-signature-icon lucide-signature h-6 w-6 text-warning-content"
                                >
                                    <path
                                        d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/>
                                    <path d="M3 21h18"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="h-16 rounded-lg md:h-24">
                <Card
                    onClick={() => {
                        if (newNotification.name) {
                            navigate(`/board/${newNotification.id}`);
                        }
                    }}
                    className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300 cursor-pointer"
                >
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-1">
                                <span className="text-sm text-base-content-900">
                                    최신 공지
                                </span>
                            <span className="mt-3 text-xs text-base-content-900">
                                    {newNotification.name ? (
                                        "[" + newNotification.name + "]" + newNotification.title
                                    ) : (
                                        "등록된 공지가 없습니다."
                                    )}
                                </span>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg !bg-error/70">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-message-square-more-icon lucide-message-square-more h-6 w-6 text-error-content"
                                >
                                    <path
                                        d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
                                    <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/>
                                    <path d="M8 6v8"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}