import api from "../../api/common/apiInterceptor.js";
import apiRoutes from "../../api/common/apiRoutes.js";

// 메일 발송
export function sendMailAPI(formData){
  return api(apiRoutes.mail.sendMail(formData));
}