import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

export function boardFileDownloadAPI(oriname, sysname) {
    return api({...apiRoutes.boardFile.download(oriname, sysname), responseType: "blob"});
}

export function deleteBoardFileAPI(id) {
    return api(apiRoutes.boardFile.delete(id));
}