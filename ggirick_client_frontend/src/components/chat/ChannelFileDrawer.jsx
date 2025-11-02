import React, { useEffect, useState, useMemo } from "react";
import CustomDrawer from "../common/Drawer";
import chatAPI from "@/api/chat/chatAPI.js";
import FileAPI from "@/api/common/FileAPI.js";
import {boardFileDownloadAPI} from "@/api/board/boardFileAPI.js";

// 확장자별 아이콘
const typeIcons = {
    mp3: "🎵",
    wav: "🎵",
    mp4: "🎬",
    mov: "🎬",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    hwp: "📝",
    xlsx: "📊",
    pdf: "📄",
    default: "📄",
};

export default function ChannelFileDrawer({ isOpen, onClose, workspaceId, channelId }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name"); // name | createdAt
    const [viewMode, setViewMode] = useState("grid"); // grid | list

    useEffect(() => {
        if (!isOpen) return;

        const fetchFiles = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await chatAPI.listFiles(workspaceId, channelId);
                setFiles(data);

            } catch (err) {
                console.error(err);
                setError("파일 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [isOpen, workspaceId, channelId]);

    const filteredFiles = useMemo(() => {
        let result = [...files];
        if (search.trim()) {
            result = result.filter(f =>
                f.filename.toLowerCase().includes(search.trim().toLowerCase())
            );
        }
        if (sortBy === "name") {
            result.sort((a, b) => a.filename.localeCompare(b.filename));
        } else if (sortBy === "createdAt") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return result;
    }, [files, search, sortBy]);


    async function handleDelete(file){
        try{
            // 서버에 삭제 요청
             await FileAPI.deleteFile(file.sysName);

            // 삭제 성공하면 상태에서 해당 파일 제거
            setFiles(prevFiles => prevFiles.filter(f => f.sysName !== file.sysName));

            await chatAPI.deleteFile(file.id);

        }catch (err){
            console.error("파일 삭제 실패", err);
            alert("파일 삭제 실패");
        }
    }

    async function handleDownload(file) {
        try {

            boardFileDownloadAPI(file.filename,file.sysName).then(resp => {
                const blobUrl = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute("download", file.filename); // 파일명 지정
                document.body.appendChild(link);
                link.click();
                link.remove();
            });

        } catch (err) {
            console.error("파일 다운로드 실패", err);
            alert("파일 다운로드 실패");
        }
    }


    return (
        <CustomDrawer isOpen={isOpen} onClose={onClose} title="채널 파일함">
            {/* 검색 + 정렬 + 뷰모드 토글 */}
            <div className="flex mb-5 space-x-2 items-center">
                <select
                    className="select select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="name">이름순</option>
                    <option value="createdAt">최신순</option>
                </select>
                <input
                    type="text"
                    placeholder="파일 이름 검색"
                    className="input input-sm flex-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* 뷰모드 토글 버튼 */}
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                >
                    {viewMode === "grid" ? "리스트 보기" : "갤러리 보기"}
                </button>
                <button onClick={onClose}>
                    X
                </button>
            </div>

            {/* 로딩/에러 */}
            {loading && <div className="text-center text-sm text-base-content/50">로딩중...</div>}
            {error && <div className="text-center text-sm text-red-500">{error}</div>}

            {/* 파일 없음 */}
            {!loading && !error && filteredFiles.length === 0 && (
                <p className="text-sm text-base-content/70">검색된 파일이 없습니다.</p>
            )}

            {/* 파일 목록 */}
            {!loading && !error && filteredFiles.length > 0 && (
                <div className={viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto"
                    : "flex flex-col space-y-2 max-h-[60vh] overflow-y-auto"}
                >
                    {filteredFiles.map(file => {
                        const ext = file.filename.split(".").pop()?.toLowerCase() || "default";
                        const icon = typeIcons[ext] || typeIcons.default;

                        return (
                            <div
                                key={file.id}
                                className={viewMode === "grid"
                                    ? "flex flex-col p-3 bg-base-100 rounded-lg shadow hover:shadow-md transition"
                                    : "flex items-center justify-between p-2 bg-base-100 rounded-md shadow-sm"}
                            >
                                {/* 아이콘 + 파일명 */}
                                <div className="flex items-center space-x-2 w-full truncate">
                                    <span className="text-2xl">{icon}</span>
                                    <span className="truncate font-medium" title={file.filename}>
                                        {file.filename}
                                    </span>
                                </div>

                                {/* 카드형에서만 미리보기 */}
                                {viewMode === "grid" && (
                                    <>
                                        {["jpg", "jpeg", "png", "gif","jfif"].includes(ext) && (
                                            <img
                                                src={file.fileUrl}
                                                alt={file.filename}
                                                className="mt-2 w-full h-32 object-cover rounded-md"
                                            />
                                        )}
                                        {["mp3", "wav"].includes(ext) && (
                                            <audio controls className="mt-2 w-full">
                                                <source src={file.fileUrl} />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                        {["mp4", "mov"].includes(ext) && (
                                            <video controls className="mt-2 w-full h-32 object-cover rounded-md">
                                                <source src={file.fileUrl} />
                                                Your browser does not support the video element.
                                            </video>
                                        )}
                                        {["pdf"].includes(ext) && (
                                            <iframe
                                                src={file.fileUrl}
                                                className="w-full h-64 border rounded-md mt-2"
                                                title={file.filename}
                                            >
                                                pdf 미리보기가 지원되지 않습니다.
                                            </iframe>
                                        )}
                                    </>
                                )}
                                {/* 파ㅏ일 삭제*/}
                                <button
                                    onClick={()=> handleDelete(file)}
                                    rel="noopener noreferrer"
                                    className="btn btn-xs btn-outline mt-2 self-end"
                                >
                                    파일 삭제
                                </button>
                                {/* 다운로드 버튼 */}
                                <button
                                   onClick={()=> handleDownload(file)}
                                    rel="noopener noreferrer"
                                    className="btn btn-xs btn-outline mt-2 self-end"
                                >
                                    다운로드
                                </button>
                                
                            </div>
                        );
                    })}
                </div>
            )}
        </CustomDrawer>
    );
}
