import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function insertAPI(resourceData) {
    console.log(insertAPI)
    return api({
        ...apiRoutes.resource.insert,
        data: resourceData,
    });
}


export function resourceListAPI() {
    return api(apiRoutes.resource.resourceList);
}