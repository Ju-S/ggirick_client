import {timestampToMonthDay} from "@/utils/common/dateFormat.js";
import {useNavigate, useParams} from "react-router-dom";
import {Paperclip} from "lucide-react";
import {boardFileDownloadAPI} from "@/api/board/boardFileAPI.js";
import {useEffect, useState} from "react";
import useEmployeeStore from "@/store/employeeStore.js";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import {deleteAPI} from "@/api/board/boardAPI.js";
import useApprovalStore from "@/store/approval/approvalStore.js";
import ApprovalLineCheck from "@/components/approval/ApprovalLineCheck.jsx";
import {getTypeAPI} from "@/api/approval/approvalTypeAPI.js";
import ApprovalAdditionalForm from "@/components/approval/ApprovalAdditionalForm.jsx";

export default function ApprovalDetailPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {
        approvalDetail,
        approvalFilesList,
        approvalLineList,
        approvalHistoryList
    } = useApprovalStore(state => state.approvalInfo);
    const fetchApprovalInfo = useApprovalStore(state => state.fetchApprovalInfo);

    const {selectedEmployee, setEmployee} = useEmployeeStore();

    const [approvalTypeList, setApprovalTypeList] = useState([]);

    useEffect(() => {
        fetchApprovalInfo(id);
        getMyInfoAPI().then(resp => {
            setEmployee(resp.data)
        });
        getTypeAPI().then(resp => setApprovalTypeList(resp.data));
    }, []);

    // 파일 다운로드 핸들러
    const handleFileClick = (file) => {
        boardFileDownloadAPI(file.name, file.url).then(resp => {
            const blobUrl = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", file.name); // 파일명 지정
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };

    // 게시글 수정 버튼
    const handleEdit = () => {
        navigate(`/approval/edit/${id}`);
    };

    // 게시글 삭제 버튼
    const handleDelete = async () => {
        if (!window.confirm("정말로 이 문서를 삭제하시겠습니까?")) return;

        try {
            deleteAPI(id)
                .then(() =>
                    navigate(`/approval`))
                .then(() =>
                    alert("문서가 삭제되었습니다."))

        } catch (err) {
            console.error("문서 삭제 실패:", err);
            alert("문서 삭제에 실패했습니다.");
        }
    };

    if (!approvalDetail || !selectedEmployee || approvalTypeList.length === 0) return null;

    return (
        <div className="space-y-4 h-200 scrollbar-hide overflow-y-auto">
            {/* 게시글 카드 */}
            {approvalDetail && selectedEmployee && (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div
                            className="flex flex-wrap justify-between items-center text-sm text-base-500 mb-3 pb-2 border-b border-base-300"
                        >
                            <div className="flex gap-2 flex-wrap">
                                <span className="badge border-none">
                                    작성자: {approvalDetail.name}
                                </span>
                                <span className="badge border-none">
                                    작성일: {timestampToMonthDay(approvalDetail.createdAt)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* 수정/삭제 버튼 — 작성자 본인만 */}
                                {selectedEmployee.id === approvalDetail.writer && (
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-xs btn-outline btn-primary"
                                            onClick={handleEdit}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="btn btn-xs btn-outline btn-error"
                                            onClick={handleDelete}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">
                            {approvalDetail.title}
                        </h2>

                        {/* 기안자 고정 표시 */}
                        <div
                            className="flex gap-3 overflow-x-auto pb-2"
                        >
                            <div
                                className="flex flex-col items-center justify-center bg-base-300 border rounded-xl p-3 min-w-[100px] min-h-[110px] shadow-sm"
                            >
                                <span className="text-sm font-semibold">기안자</span>
                                <span className="text-sm mt-1">{approvalDetail.name}</span>
                                <span
                                    className="text-xs text-base-content-500">{approvalDetail.departmentName}</span>
                            </div>
                            <ApprovalLineCheck approvalId={id}/>
                        </div>

                        <div className="mb-4">
                            <ApprovalAdditionalForm
                                docTypeCode={approvalDetail.docTypeCode}
                                viewMode={true}
                                setDocData={null}
                                docData={approvalDetail.docData}
                            />
                        </div>

                        <div className="prose max-w-none whitespace-pre-wrap text-base leading-relaxed mb-6">
                            {approvalDetail.content}
                        </div>

                        {/* 파일 첨부 목록 */}
                        {approvalFilesList && approvalFilesList.length > 0 && (
                            <div className="mt-4 border-t border-base-300 pt-4">
                                <div className="flex items-center gap-2 mb-2 text-base font-semibold">
                                    <Paperclip className="w-4 h-4 text-primary"/>
                                    첨부파일
                                </div>
                                <ul className="space-y-2">
                                    {approvalFilesList.map((file) => (
                                        <li
                                            key={file.id}
                                            className="flex items-center justify-between bg-base-200 p-3 rounded-lg hover:bg-base-300 transition cursor-pointer"
                                            onClick={() => handleFileClick(file)}
                                        >
                                            <div className="truncate flex items-center gap-2">
                                                <span className="text-base-content">{file.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* 결재 기록 목록 */}
            <div>
                {approvalHistoryList.length > 0 ? (
                    approvalHistoryList.map((history) => (
                        <div className="card bg-base-100 shadow-sm mb-3" key={history.id}>
                            <div className="card-body p-4">
                                <div className="flex justify-between items-center text-sm text-base-600 mb-2">
                    <span className="font-semibold">
                        {history.name} -> {history.typeId === 1 && history.isDelegated === "Y"
                        ? "대결"
                        : approvalTypeList.find(e => e.id === history.typeId)?.description
                    }
                    </span>
                                    <span>{timestampToMonthDay(history.recordedAt)}</span>
                                </div>
                                <p className="text-base-800 whitespace-pre-wrap mb-2">{history.contents}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-base text-base-content/50">
                        아직 기록된 결재변경이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
