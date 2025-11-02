import {Card} from "flowbite-react";
import useDashboardStore from "@/store/dashboard/useDashboardStore.js";
import descriptionAndNavigateURLByType from "@/utils/dashboard/descriptionAndNavigateURLByType.jsx";

export default function DashboardRecentActivities() {
    const recentActivities = useDashboardStore(state => state.recentActivities);

    return (
        <div className="h-32 rounded-lg md:h-72">
            <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
                <div className="flex items-start justify-start">
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trending-up-icon text-base-content-800 h-6 w-6"
                            >
                                <path d="M16 7h6v6"/>
                                <path d="m22 7-8.5 8.5-5-5L2 17"/>
                            </svg>
                            <span className="text-m text-base-content-900">
                                최근 활동
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 min-h-[200px]">
                            {recentActivities && recentActivities.length > 0 ? (
                                recentActivities.map((e) => {
                                    const {description, onClickEvent} = descriptionAndNavigateURLByType(e);

                                    return (
                                        <Card
                                            key={e.id}
                                            onClick={onClickEvent}
                                            className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800 cursor-pointer"
                                        >
                                            {description}
                                        </Card>
                                    );
                                })
                            ) : (
                                // 비어 있을 때도 높이 확보용 placeholder
                                <div
                                    className="flex flex-col justify-center items-center h-full text-base-content">
                                    <p className="italic text-sm">최근 활동이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}