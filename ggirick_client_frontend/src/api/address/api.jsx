import api from "../../commons/api/apiInterceptor.js";
import apiRoutes from "../../commons/api/apiRoutes.js";

// 대분류 그룹 가져옴
export function getGroupTypeAPI(){
  return api(apiRoutes.address.getGroupType)
}

// 소분류 그룹 가져옴
export function getSubGroupAPI(){
  return api(apiRoutes.address.getSubGroup)
}

