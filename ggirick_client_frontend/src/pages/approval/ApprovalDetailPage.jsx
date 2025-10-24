import {timestampToMonthDay} from "@/utils/board/boardDateFormat.js";
import CommentItem from "@/components/board/CommentItem.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {buildCommentTree} from "@/utils/board/buildCommentTree.js";
import {Paperclip} from "lucide-react";
import {boardFileDownloadAPI} from "@/api/board/boardFileAPI.js";
import {useEffect, useState} from "react";
import useBoardStore from "@/store/board/boardStore.js";
import useEmployeeStore from "@/store/employeeStore.js";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import {insertCommentAPI} from "@/api/board/boardCommentAPI.js";
import {deleteAPI} from "@/api/board/boardAPI.js";

export default function ApprovalDetailPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {boardDetail, commentList, fileList} = useBoardStore(state => state.boardInfo);
    const fetchBoardInfo = useBoardStore(state => state.fetchBoardInfo);
    const treeComments = buildCommentTree(commentList || []);

    const [comment, setComment] = useState("");
    const [refId, setRefId] = useState(-1);
    const [loading, setLoading] = useState(false);

    const {selectedEmployee, setEmployee} = useEmployeeStore();

    useEffect(() => {
        fetchBoardInfo(id);
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

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            await insertCommentAPI(id, refId, comment);

            // 입력창 초기화
            setComment("");
            setRefId(-1);

            fetchBoardInfo(id);
        } catch (err) {
            console.error("댓글 등록 실패:", err);
            alert("댓글 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 게시글 수정 버튼
    const handleEdit = () => {
        navigate(`/board/edit/${id}`);
    };

    // 게시글 삭제 버튼
    const handleDelete = async () => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

        try {
            deleteAPI(id)
                .then(() =>
                    navigate(`/board?groupId=${boardDetail.boardGroupId}`))
                .then(() =>
                    alert("게시글이 삭제되었습니다."))

        } catch (err) {
            console.error("게시글 삭제 실패:", err);
            alert("게시글 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="space-y-4 h-200 scrollbar-hide overflow-y-auto">
            {/* 게시글 카드 */}
            {boardDetail && (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div
                            className="flex flex-wrap justify-between items-center text-sm text-base-500 mb-3 pb-2 border-b border-base-300"
                        >
                            <div className="flex gap-2 flex-wrap">
                                <span className="badge border-none">
                                    작성자: {boardDetail.name}
                                </span>
                                <span className="badge border-none">
                                    작성일: {timestampToMonthDay(boardDetail.createdAt)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="badge border-none">
                                    조회수: {boardDetail.viewCount}
                                </span>

                                {/* 수정/삭제 버튼 — 작성자 본인만 */}
                                {selectedEmployee.id === boardDetail.writer && (
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
                            {boardDetail.title}
                        </h2>

                        <div className="prose max-w-none whitespace-pre-wrap text-base leading-relaxed mb-6">
                            {boardDetail.contents}
                        </div>

                        {/* 파일 첨부 목록 */}
                        {fileList && fileList.length > 0 && (
                            <div className="mt-4 border-t border-base-300 pt-4">
                                <div className="flex items-center gap-2 mb-2 text-base font-semibold">
                                    <Paperclip className="w-4 h-4 text-primary"/>
                                    첨부파일
                                </div>
                                <ul className="space-y-2">
                                    {fileList.map((file) => (
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

            {/* 댓글 입력 */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <h3 className="text-lg font-semibold mb-2">댓글 작성</h3>
                    <textarea
                        className="textarea textarea-bordered w-full h-24 resize-none"
                        placeholder="댓글을 입력하세요..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    ></textarea>
                    <div className="card-actions justify-end mt-2">
                        <button
                            className={`btn btn-primary ${loading ? "loading" : ""}`}
                            onClick={handleCommentSubmit}
                            disabled={loading}
                        >
                            {loading ? "등록 중..." : "등록"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 댓글 목록 */}
            <div>
                {treeComments.length > 0 ? (
                    treeComments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment}/>
                    ))
                ) : (
                    <div className="text-center text-base text-base-content/50">
                        아직 등록된 댓글이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
