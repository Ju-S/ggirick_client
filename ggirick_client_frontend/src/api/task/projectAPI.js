import api from "../common/apiInterceptor.js";
import apiRoutes from "../common/apiRoutes.js";

export function fetchAvailableMembersAPI(){

};

export function removeMemberAPI(){

}

export function addMemberAPI(){

}

export function projectListAPI() {
  return api(apiRoutes.project.list);
}


export const projectCreateAPI = (data) =>
    api({
     ...apiRoutes.project.insert,
        data: data
    })