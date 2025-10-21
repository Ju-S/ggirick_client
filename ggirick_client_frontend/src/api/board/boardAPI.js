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