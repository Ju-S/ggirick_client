export function buildCommentTree(commentList) {
    const commentMap = {};
    const rootComments = [];

    // 1. 모든 댓글을 id 기준으로 Map에 저장
    commentList.forEach(comment => {
        comment.replies = []; // 대댓글 담을 배열
        commentMap[comment.id] = comment;
    });

    // 2. 부모-자식 관계 구성
    commentList.forEach(comment => {
        if (comment.refCommentId) {
            // refCommentId가 있으면 부모 댓글에 추가
            const parent = commentMap[comment.refCommentId];
            if (parent) parent.replies.push(comment);
        } else {
            // 없으면 루트 댓글
            rootComments.push(comment);
        }
    });

    return rootComments;
}
