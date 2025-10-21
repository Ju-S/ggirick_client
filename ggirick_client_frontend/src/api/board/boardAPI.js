import api from "../common/apiInterceptor.js";
import apiRoutes from "../common/apiRoutes.js";

export function insertAPI(boardInfos) {
    return api({...apiRoutes.board.insert, data:boardInfos});
}

export function deleteAPI(boardId) {
    return api(apiRoutes.board.delete(boardId));
}

export function boardListAPI(currentPage, groupId, searchFilter, searchQuery) {
    return api(apiRoutes.board.list(currentPage, groupId,searchFilter, searchQuery));
}

export function itemAPI(boardId) {
    return api(apiRoutes.board.item(boardId));
}

export function putAPI(boardItem) {
    return api({...apiRoutes.board.put, data:boardItem});
}

export function boardGroupListAPI() {
    return api(apiRoutes.boardGroup.list());
}

export function boardGroupMemberListAPI(groupId) {
    return api(apiRoutes.boardGroup.members(groupId));
}

export function putGroupMemberAPI(members, groupId) {
    return api({...apiRoutes.boardGroup.put(groupId), data: members});
}

export function boardFileDownloadAPI(oriname, sysname) {
    return api({...apiRoutes.boardFile.download(oriname, sysname), responseType: "blob"});
}

export function insertCommentAPI(boardId, refId, comment) {
    return api({...apiRoutes.boardComment.insert(boardId, refId), data: {contents: comment}});
}

export function deleteCommentAPI(boardId, refId) {
    return api(apiRoutes.boardComment.delete(boardId, refId));
}

export function updateCommentAPI(boardId, refId, comment) {
    return api({...apiRoutes.boardComment.put(boardId, refId), data: comment});
}