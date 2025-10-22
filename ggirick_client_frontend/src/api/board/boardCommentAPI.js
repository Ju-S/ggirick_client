import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function insertCommentAPI(boardId, refId, comment) {
    return api({...apiRoutes.boardComment.insert(boardId, refId), data: {contents: comment}});
}

export function deleteCommentAPI(boardId, commentId) {
    return api(apiRoutes.boardComment.delete(boardId, commentId));
}

export function updateCommentAPI(boardId, commentId, comment) {
    return api({...apiRoutes.boardComment.put(boardId, commentId), data: {contents: comment}});
}