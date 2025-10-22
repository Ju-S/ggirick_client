import api from "../../api/common/apiInterceptor.js";
import apiRoutes from "../../api/common/apiRoutes.js";

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

// 주소록 수정
export function updateAddressAPI(addressId, updatedData) {
  return api({...apiRoutes.address.updateAddress(addressId),data: updatedData});
}

// 주소록 삭제
export function deleteAddressAPI(addressId) {
  return api(apiRoutes.address.deleteAddress(addressId))
}

// 공유주소록 부서 가져오기
export function getDepartmentsAPI(){
  return api(apiRoutes.address.getDepartments())
}

// 부서에 주소록정보 가져오기
export function getSharedAddressesAPI(code){
  return api(apiRoutes.address.getSharedAddresses(code))
}