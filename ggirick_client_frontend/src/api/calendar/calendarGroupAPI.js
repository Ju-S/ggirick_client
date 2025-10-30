import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function getCalendarListAPI(groupId) {
    return api(apiRoutes.calendarGroup.getCalendarList(groupId));
}

export function getGroupListAPI() {
    return api(apiRoutes.calendarGroup.getGroupList());
}

export function insertAPI(data) {
    return api({...apiRoutes.calendarGroup.insert(), data: data});
}

export function updateAPI(groupId, data) {
    return api({...apiRoutes.calendarGroup.update(groupId), data: data});
}

export function deleteAPI(groupId) {
    return api(apiRoutes.calendarGroup.delete(groupId));
}

export function calendarGroupMemberListAPI(groupId) {
    return api(apiRoutes.calendarGroup.members(groupId));
}

export function putGroupMemberAPI(members, groupId) {
    return api({...apiRoutes.calendarGroup.putMembers(groupId), data: members});
}