import useApprovalStore from "@/store/approval/approvalStore.js";
import {useEffect, useState} from "react";
import {getTypeAPI} from "@/api/approval/approvalTypeAPI.js";
import useEmployeeStore from "@/store/employeeStore.js";
import {insertAPI} from "@/api/approval/approvalHistoryAPI.js";
import {useNavigate} from "react-router-dom";

export default function ApprovalLineCheck({approvalId}) {
    const {approvalLineList, approvalHistoryList, approvalDetail, delegateOriginList} = useApprovalStore(state => state.approvalInfo);
    const {selectedEmployee} = useEmployeeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [approvalTypeList, setApprovalTypeList] = useState([]);
    const [selectedApprovalType, setSelectedApprovalType] = useState(0);
    const navigate = useNavigate();

    const handleApproval = () => {
        // 실제 결재 로직 실행
        if (selectedApprovalType !== 0) {
            const data = {
                contents: comment,
                typeId: selectedApprovalType
            }

            insertAPI(approvalId, data).then(() => {
                setSelectedApprovalType(0);
                setComment("");
                setIsModalOpen(false);
                navigate("/approval");
            });
        } else {
            alert("결재 유형을 선택해주세요.");
        }
    };

    useEffect(() => {
        getTypeAPI().then(resp => setApprovalTypeList(resp.data.filter(e => e.description !== "취소")));
    }, []);

    return (
        <>
            {approvalLineList && approvalLineList.map((e) => (
                <div
                    className="relative flex flex-col items-center justify-center border rounded-xl p-3 min-w-[100px] min-h-[110px] shadow-sm">
                    {/* 결재 상태 원형 워터마크 */}
                    {(() => {
                        // 해당 assigner의 history만 가져오기
                        const histories = approvalHistoryList
                            .filter(h => h.assigner === e.assigner)
                            .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)); // 최신 순 정렬

                        const latest = histories[0]; // 최신 기록
                        if (!latest) return null;
                        if (new Date(latest?.recordedAt) < new Date(approvalDetail.updatedAt)) return null;
                        let text = "";
                        let bgColor = "";

                        switch (latest.typeId) {
                            case 1:
                                text = latest.isDelegated === "Y" ? "대결" : "승인";
                                bgColor = "bg-success";
                                break;
                            case 2:
                                text = "반려";
                                bgColor = "bg-error";
                                break;
                            default:
                                return null;
                        }

                        return (
                            <div
                                className={`absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${bgColor} opacity-50`}>
                                {text}
                            </div>
                        );
                    })()}
                    <span className="text-sm mt-1">{e.name}</span>
                    <span className="text-xs text-base-content-500">{e.departmentName}</span>
                    {(e.assigner === selectedEmployee.id || delegateOriginList.includes(e.assigner)) && approvalDetail.assignedAt == null && (() => {
                        // 해당 assigner의 history만 가져오기
                        const histories = approvalHistoryList
                            .filter(h => h.assigner === e.assigner)
                            .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)); // 최신 순 정렬

                        const latest = histories[0]; // 최신 기록

                        // 최신 기록이 typeId 1이면 버튼 숨김
                        if (latest?.typeId === 1 && new Date(latest?.recordedAt) > new Date(approvalDetail.updatedAt)){
                            return null;
                        }

                        return (
                            <div className="mt-2 flex justify-end">
                                <button
                                    className="btn btn-xs btn-primary"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    {(latest?.typeId === 3 && new Date(latest?.recordedAt) > new Date(approvalDetail.updatedAt)) ? "협의 중" : "결재"}
                                </button>
                            </div>
                        );
                    })()}
                </div>
            ))}
            {/* 모달 */}
            {isModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-96">
                        <h3 className="font-bold text-lg mb-4">결재 처리</h3>

                        {/* 드롭다운 */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">결재 상태</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={selectedApprovalType}
                                onChange={(e) => setSelectedApprovalType(e.target.value)}
                                required
                            >
                                <option disabled selected value={0}>결재 유형 선택</option>
                                {approvalTypeList.map(e => (
                                    <option
                                        className={e.id === selectedApprovalType ? "active:bg-base-300 active:shadow-none bg-primary text-primary-content" : "active:bg-base-300 active:shadow-none bg-base text-base-content"}
                                        selected={e.id === selectedApprovalType}
                                        value={e.id}
                                    >
                                        {e.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 의견 입력 */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">사유</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="사유를 입력하세요"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>

                        {/* 버튼 */}
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleApproval}>
                                결재
                            </button>
                            <button className="btn" onClick={() => setIsModalOpen(false)}>
                                취소
                            </button>
                        </div>
                    </div>

                    {/* 모달 배경 클릭 시 닫기 */}
                    <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </>
    );
}