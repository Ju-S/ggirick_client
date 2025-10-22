import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function boardGroupListAPI() {
    return api(apiRoutes.boardGroup.list());
}

export function boardGroupMemberListAPI(groupId) {
    return api(apiRoutes.boardGroup.members(groupId));
}

export function putGroupMemberAPI(members, groupId) {
    return api({...apiRoutes.boardGroup.put(groupId), data: members});
}

export function addBoardGroup(groupInfo) {
    return api({...apiRoutes.boardGroup.insert, data: groupInfo});
}