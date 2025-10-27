import {timestampToMonthDay} from "@/utils/common/dateFormat.js";
import {useNavigate, useParams} from "react-router-dom";
import {Paperclip} from "lucide-react";
import {boardFileDownloadAPI} from "@/api/board/boardFileAPI.js";
import {useEffect} from "react";
import useEmployeeStore from "@/store/employeeStore.js";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import {deleteAPI} from "@/api/board/boardAPI.js";
import useApprovalStore from "@/store/approval/approvalStore.js";
import ApprovalLineCheck from "@/components/approval/ApprovalLineCheck.jsx";

export default function ApprovalDetailPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {approvalDetail, approvalFilesList, approvalLineList} = useApprovalStore(state => state.approvalInfo);
    const fetchApprovalInfo = useApprovalStore(state => state.fetchApprovalInfo);

    const {selectedEmployee, setEmployee} = useEmployeeStore();

    useEffect(() => {
        fetchApprovalInfo(id);
        getMyInfoAPI().then(resp => {
            setEmployee(resp.data)
        });
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
                            {/* 조회된 결재선으로 employee를 조회하여 정보 출력 */}
                            <ApprovalLineCheck approvalId={id}/>
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
        </div>
    );
}
