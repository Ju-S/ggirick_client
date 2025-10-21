import {useState} from "react";
import {timestampToMonthDay} from "@/utils/board/boardDateFormat.js";
import {insertCommentAPI} from "@/api/board/boardAPI.js";
import {useParams} from "react-router-dom";

export default function CommentItem({ comment, depth = 0, refetch }) {
    const [showReply, setShowReply] = useState(false);

    const [contents, setContents] = useState("");
    const [refId] = useState(comment.id);
    const [loading, setLoading] = useState(false);

    // 댓글 스타일 결정
    const cardClass = depth === 0 ?
        `card bg-base-100 shadow-sm mb-3`
    :
    "card bg-base-100 mb-3 border-t border-base-content/10 rounded-none"; // 대댓글: 연한 테두리

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!contents.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            await insertCommentAPI(comment.boardId, refId, contents);

            // 입력창 초기화
            setContents("");

            // 최신 댓글 목록 다시 불러오기
            if (refetch) refetch();
            setShowReply(false);
        } catch (err) {
            console.error("댓글 등록 실패:", err);
            alert("댓글 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={cardClass}
            style={{ marginLeft: `${depth * 2}rem` }}
        >
            <div className="card-body p-4">
                {/* 작성자, 날짜 */}
                <div className="flex justify-between items-center text-sm text-base-600 mb-2">
                    <span className="font-semibold">{comment.name}</span>
                    <span>{timestampToMonthDay(comment.createdAt)}</span>
                </div>

                {/* 댓글 내용 */}
                <p className="text-base-800 whitespace-pre-wrap mb-2">
                    {comment.contents}
                </p>

                {/* 답글 버튼 */}
                <div className="card-actions justify-end">
                    <button
                        className="btn btn-xs btn-outline btn-primary"
                        onClick={() => setShowReply(!showReply)}
                    >
                        {showReply ? "취소" : "답글"}
                    </button>
                </div>

                {/* 답글 입력창 */}
                {showReply && (
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
