import api from "../common/apiInterceptor.js";
import apiRoutes from "../common/apiRoutes.js";

export function insertAPI(task){
  return api({
    ...apiRoutes.task.insert,
    data: task
  })
}

export function updateStatusAPI(taskId, status) {
  return api({
    ...apiRoutes.task.updateStatus(taskId),
    data: { status }
  })
}

export function updateAPI(taskId, data) {
  return api({
    ...apiRoutes.task.update(taskId),
    data: data
  })
}

export function deleteAPI(taskId) {
  return api(apiRoutes.task.delete(taskId));
}