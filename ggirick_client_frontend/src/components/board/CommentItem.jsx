import {useState} from "react";
import {timestampToMonthDay} from "@/utils/board/boardDateFormat.js";

export default function CommentItem({ comment, depth = 0 }) {
    const [showReply, setShowReply] = useState(false);

    // 댓글 스타일 결정
    const cardClass = depth === 0 ?
        `card bg-base-100 shadow-sm mb-3`
    :
    "card bg-base-100 mb-3 border-t border-base-content/10 rounded-none"; // 대댓글: 연한 테두리

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
                        ></textarea>
                        <div className="card-actions justify-end mt-2">
                            <button className="btn btn-sm btn-primary">등록</button>
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
