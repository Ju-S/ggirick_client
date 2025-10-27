import useApprovalStore from "@/store/approval/approvalStore.js";
import {useEffect, useState} from "react";
import {getTypeAPI} from "@/api/approval/approvalTypeAPI.js";
import useEmployeeStore from "@/store/employeeStore.js";
import {insertAPI} from "@/api/approval/approvalHistoryAPI.js";

export default function ApprovalLineCheck({approvalId}) {
    const {approvalLineList} = useApprovalStore(state => state.approvalInfo);
    const {selectedEmployee} = useEmployeeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [approvalTypeList, setApprovalTypeList] = useState([]);
    const [selectedApprovalType, setSelectedApprovalType] = useState(0);

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
            {approvalLineList && approvalLineList.map((e, idx) => (
                <div
                    className="flex flex-col items-center justify-center bg-base-300 border rounded-xl p-3 min-w-[100px] min-h-[110px] shadow-sm"
                >
                    <span className="text-sm font-semibold">{idx + 1}차</span>
                    <span className="text-sm mt-1">{e.name}</span>
                    <span
                        className="text-xs text-base-content-500">{e.departmentName}</span>
                    {e.assigner === selectedEmployee.id &&
                        <div className="mt-2 flex justify-end">
                            <button
                                className="btn btn-xs btn-primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                결재
                            </button>
                        </div>
                    }
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