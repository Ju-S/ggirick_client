import api from "../common/apiInterceptor.js";
import apiRoutes from "../common/apiRoutes.js";

export function insertAPI(reservationData) {
  return api({
    ...apiRoutes.reservation.insert,
    data: reservationData,
  });
}

export function deleteAPI(reservationId) {
  return api(apiRoutes.reservation.delete(reservationId));
}

export function updateAPI(reservationId, updatedData) {
  return api({
    ...apiRoutes.reservation.update(reservationId),
    data: updatedData,
  });
}

export function projectListAPI() {
  return api(apiRoutes.project.list);
}