import api from "../../api/common/apiInterceptor.js";
import apiRoutes from "../../api/common/apiRoutes.js";

// 메일 발송
export function sendMailAPI(formData){
  return api(apiRoutes.mail.sendMail(formData));
}

// folder: 'all'|'inbox'|'sent'|'important'|'spam'|'trash'
export function fetchUsersMailsAPI(folder, email) {
  return api(apiRoutes.mail.getList(folder, email));
}

export function fetchMailDetailAPI(id) {
  return api(apiRoutes.mail.getDetail(id));
}

export function changeReceiverStatusAPI(body) {
  return api(apiRoutes.mail.changeReceiverStatus(), { data: body });
}

export function deleteReceiverAPI(id) {
  return api(apiRoutes.mail.deleteReceiver(id));
}
