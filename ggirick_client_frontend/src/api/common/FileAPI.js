import apiRoutes from "./apiRoutes.js";
import api from "./apiInterceptor.js";

const FileAPI = {
    /**
     * 단일 파일 업로드
     * @param {File} file 업로드할 파일 객체
     * @param {string} folder 업로드 경로 (예: "chat/images/" 또는 "board/files/")
     * @returns {Promise<{url: string}>} 업로드된 파일의 공개 URL
     */
    async uploadFile(file, folder = "uploads/") {
        const formData = new FormData();
        formData.append("file", file);

        const route = apiRoutes.file.upload(folder);

        const response = await api.request({
            url: route.url,
            method: route.method,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },

    /**
     * 파일 삭제
     * @param {string} sysName 시스템 파일명 (GCS 경로 포함)
     */
    async deleteFile(sysName) {
        const route = apiRoutes.file.delete(sysName);
        console.log(route.url)
        const response = await api.request({
            url: route.url,
            method: route.method,
            params: {file: sysName}
        });
        return response.data;
    },

    /**
     * 파일 다운로드용 URL 생성
     * @param {string} sysName 시스템 파일명
     * @returns {string} 다운로드를 위한 서버 URL
     */
    async downloadFile(sysName) {
        const route = apiRoutes.file.download(sysName);
        return await api.request({
            url: route.url,
            method: route.method,
            responseType: "blob"
        });
    }
};

export default FileAPI;
