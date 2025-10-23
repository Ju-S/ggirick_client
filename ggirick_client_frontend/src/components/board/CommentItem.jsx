import {useState} from "react";
import {timestampToMonthDay} from "@/utils/board/boardDateFormat.js";
import {insertCommentAPI, updateCommentAPI, deleteCommentAPI} from "@/api/board/boardCommentAPI.js";
import useBoardStore from "@/store/board/boardStore.js";
import useEmployeeStore from "@/store/employee/employeeStore.js";

export default function CommentItem({comment, depth = 0}) {
    const [showReply, setShowReply] = useState(false);
    const [contents, setContents] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editContents, setEditContents] = useState(comment.contents); // 수정용 상태
    const [loading, setLoading] = useState(false);

    const refetch = useBoardStore(state => state.fetchBoardInfo);
    const {selectedEmployee} = useEmployeeStore();

    const isDeleted = comment.contents === "ZGVsZXRlZEdnaXJpY2tCb2FyZENvbW1lbnQ=";

    // 댓글 스타일 결정
    const cardClass = depth === 0
        ? `card bg-base-100 shadow-sm mb-3`
        : "card bg-base-100 mb-3 border-t border-base-content/10 rounded-none";

    // 수정모드 시작
    const handleEdit = () => setEditMode(true);
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditContents(comment.contents);
    };

    const handleSaveEdit = async () => {
        if (!editContents.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        try {
            setLoading(true);
            await updateCommentAPI(comment.boardId, comment.id, editContents);
            setEditMode(false);
            if (refetch) refetch(comment.boardId);
        } catch (err) {
            console.error("댓글 수정 실패:", err);
            alert("댓글 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
        try {
            await deleteCommentAPI(comment.boardId, comment.id);
            if (refetch) refetch(comment.boardId);
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    const handleCommentSubmit = async () => {
        if (!contents.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        try {
            setLoading(true);
            await insertCommentAPI(comment.boardId, comment.id, contents);
            setContents("");
            setShowReply(false);
            if (refetch) refetch(comment.boardId);
        } catch (err) {
            alert("댓글 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={cardClass}
            style={{marginLeft: `${depth * 2}rem`}}
        >
            <div className="card-body p-4">
                {/* 작성자, 날짜 */}
                <div className="flex justify-between items-center text-sm text-base-600 mb-2">
                    <span className="font-semibold">
                        {isDeleted ? "삭제된 댓글" : comment.name}
                    </span>
                    <span>{isDeleted ? "" : timestampToMonthDay(comment.createdAt)}</span>
                </div>

                {/* 댓글 내용 / 삭제된 댓글 UI / 수정 입력창 */}
                {isDeleted ? (
                    <p className="text-base-400 italic">이 댓글은 삭제되었습니다.</p>
                ) : editMode ? (
                    <textarea
                        className="textarea textarea-bordered w-full h-24 resize-none mb-2"
                        value={editContents}
                        onChange={(e) => setEditContents(e.target.value)}
                    ></textarea>
                ) : (
                    <p className="text-base-800 whitespace-pre-wrap mb-2">{comment.contents}</p>
                )}

                {/* 버튼 영역 */}
                {!isDeleted && (
                    <div className="card-actions justify-end">
                        {!editMode && (
                            <button
                                className="btn btn-xs btn-primary"
                                onClick={() => setShowReply(!showReply)}
                            >
                                {showReply ? "취소" : "답글"}
                            </button>
                        )}

                        {selectedEmployee.id === comment.writer && (
                            <div className="flex gap-2">
                                {editMode ? (
                                    <>
                                        <button
                                            className={`btn btn-xs btn-primary ${loading ? "loading" : ""}`}
                                            onClick={handleSaveEdit}
                                            disabled={loading}
                                        >
                                            {loading ? "저장 중..." : "수정 완료"}
                                        </button>
                                        <button
                                            className="btn btn-xs btn-outline btn-error"
                                            onClick={handleCancelEdit}
                                            disabled={loading}
                                        >
                                            수정 취소
                                        </button>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 답글 입력창 */}
                {showReply && !editMode && !isDeleted && (
                    <div className="mt-3">
                        <textarea
                            className="textarea textarea-bordered w-full h-20 resize-none"
                            placeholder="답글을 입력하세요..."
                            value={contents}
                            onChange={e => setContents(e.target.value)}
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
                )}

                {/* 대댓글 재귀 렌더링 */}
                {comment.replies?.length > 0 && (
                    <div className="mt-3">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                refetch={refetch}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
