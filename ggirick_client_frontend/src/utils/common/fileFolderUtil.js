// 파일 타입 기반 서브폴더 매핑
const fileTypeFolders = {
    image: "images/",
    audio: "audios/",
    video: "videos/",
    pdf: "docs/",
    excel: "docs/",
    word: "docs/",
    hwp: "docs/",
    default: "",
};

/**
 * 업로드 폴더 결정
 * @param {File} file 업로드 파일
 * @param {string} rootFolder chat, task, board 등
 * @returns {string} 최종 업로드 경로
 */
export function getUploadFolder(file, rootFolder = "uploads") {
    const { type, name } = file;
    let subFolder = fileTypeFolders.default;

    if (type.startsWith("image/")) subFolder = fileTypeFolders.image;
    if (type.startsWith("audio/")) subFolder = fileTypeFolders.audio;
    else if (type.startsWith("video/")) subFolder = fileTypeFolders.video;
    else if (type === "application/pdf") subFolder = fileTypeFolders.pdf;
    else {
        const ext = name.split(".").pop().toLowerCase();
        if (["xls", "xlsx"].includes(ext)) subFolder = fileTypeFolders.excel;
        else if (["doc", "docx"].includes(ext)) subFolder = fileTypeFolders.word;
        else if (["hwp"].includes(ext)) subFolder = fileTypeFolders.hwp || fileTypeFolders.default;
    }

    return `${rootFolder}/${subFolder}`;
}
