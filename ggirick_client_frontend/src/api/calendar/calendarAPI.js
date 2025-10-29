import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function getListAPI() {
    return api(apiRoutes.calendar.getList());
}

export function insertAPI(data) {
    return api({...apiRoutes.calendar.insert(), data: data});
}

export function updateAPI(calendarId, data) {
    return api({...apiRoutes.calendar.update(calendarId), data: data});
}

export function deleteAPI(calendarId) {
    return api(apiRoutes.calendar.delete(calendarId));
}