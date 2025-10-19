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

// 소분류 그룹 생성
export function createSubGroupAPI(groupName){
  return api(apiRoutes.address.createSubGroup(groupName))
}

// 소분류 그룹 삭제
export function deleteSubGroupAPI(subGroupId) {
  return api(apiRoutes.address.deleteSubGroup(subGroupId));
}

// 소분류 클릭 시 해당 주소록 조회
export function getAddressesBySubGroupAPI(subGroupId) {
  return api(apiRoutes.address.getAddressesBySubGroup(subGroupId));
}