import api from "../common/apiInterceptor.js";
import apiRoutes from "../common/apiRoutes.js";

export function insertAPI() {
    return api(apiRoutes.board.insert);
}

export function deleteAPI(boardId) {
    return api(apiRoutes.board.delete(boardId));
}

export function boardListAPI(currentPage, searchQuery) {
    return api(apiRoutes.board.list(currentPage, searchQuery));
}

export function itemAPI(boardId) {
    return api(apiRoutes.board.item(boardId));
}

export function putAPI(boardItem) {
    return api({...apiRoutes.board.put, data:boardItem});
}