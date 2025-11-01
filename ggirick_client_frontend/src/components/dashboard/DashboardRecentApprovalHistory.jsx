import {useNavigate} from "react-router-dom";
import useDashboardStore from "@/store/dashboard/useDashboardStore.js";
import {Card} from "flowbite-react";
import {timestampToMonthDay} from "@/utils/common/dateFormat.js";
import useApprovalDocType from "@/hooks/approval/useApprovalDocType.js";

export default function DashboardRecentApprovalHistory() {
    const navigate = useNavigate();

    const approvalList = useDashboardStore(state => state.approvalList);

    // 결재기안 문서 종류
    const docType = useApprovalDocType();

    return (
        <div className="h-48 rounded-lg md:h-80">
            <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clipboard-list text-base-content-800 h-6 w-6"
                        >
                            <path
                                d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/>
                            <path d="M3 21h18"/>
                        </svg>
                        <span className="text-m text-base-content-900 font-semibold">최근 결재 현황</span>
                    </div>

                    {/* overflow 제거, 최대 3개만 출력 */}
                    <div className="flex flex-col gap-3">
                        {approvalList && approvalList.length > 0 ? (
                            approvalList.slice(0, 3).map((e) => (
                                <Card
                                    key={e.history.id}
                                    onClick={() => navigate(`/approval/${e.approval.id}`)}
                                    className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-200 cursor-pointer py-2 flex flex-col justify-between"
                                >
                                    {/* 상단: 제목 + 우측(상태 뱃지 + 문서유형) */}
                                    <div className="flex items-center justify-between relative">
                                                <span
                                                    className="font-medium text-base-content-900 truncate"
                                                    style={{maxWidth: "calc(100% - 110px)"}} // 뱃지영역 고려
                                                >
                                                    <span className="text-sm font-bold text-base mr-2 truncate">
                                                        {e.approval.name}
                                                    </span>
                                                    <span className="truncate">
                                                        {e.approval.title}
                                                    </span>
                                                </span>

                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <div
                                                className={`badge badge-sm badge-soft ${
                                                    e.approval.typeId === 1
                                                        ? "badge-success"
                                                        : e.approval.typeId === 2
                                                            ? "badge-error"
                                                            : "badge-base"
                                                }`}
                                            >
                                                {e.approval.typeId === 1 ? "승인" : e.history.typeId === 2 ? "반려" : "진행중"}
                                            </div>

                                            <div className="badge badge-sm bg-base-300">
                                                {docType.find((t) => t.code === e.approval.docTypeCode)?.name || ""}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 하단: 결재자 + 날짜 (한 줄) */}
                                    <span className="text-xs text-base-content-700 relative bottom-3 truncate">
                                                {e.history.name} -> {e.history.typeId === 1 ? "승인" : e.history.typeId === 2 ? "반려" : "의견"} • {timestampToMonthDay(e.history.recordedAt)}
                                            </span>
                                </Card>
                            ))
                        ) : (
                            <div
                                className="flex justify-center items-center h-full text-sm italic text-base-content-600">
                                결재 현황이 없습니다.
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate("approval")}
                        className="mt-auto h-8 w-full rounded-lg border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800 cursor-pointer"
                    >
                        전체 결재 보기
                    </button>
                </div>
            </Card>
        </div>
    );
}