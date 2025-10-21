import api from "../common/apiInterceptor.js";
import apiRoutes from "../common/apiRoutes.js";

export function fetchAvailableMembersAPI(){

};

export function updateProjectAPI(projectId, data){
    api({
        ...apiRoutes.project.update(projectId),
        data:data,
    })
}


export const syncMembersAPI = (projectId, data) =>

    api({
        ...apiRoutes.project.syncMembers(projectId),
        data: data,
    });


export function projectListAPI() {
  return api(apiRoutes.project.list);
}


export const projectCreateAPI = (data) =>
    api({
     ...apiRoutes.project.insert,
        data: data
    })

