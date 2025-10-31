import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function insertAPI(resourceData) {
    return api({
        ...apiRoutes.resource.insert,
        data: resourceData,

    });
}

export const getResourceTypesAPI = () => {
    return api.get("/reservations/resource/type");
};

export function resourceListAPI() {
    return api(apiRoutes.resource.resourceList);
}