import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { timestampToMonthDay } from "../../utils/common/dateFormat.js";

export default function BoardList({ boardInfos }) {
    const navigate = useNavigate();
    const [showAllNotices, setShowAllNotices] = useState(false);

    const { boardNotificationList = [], boardList = [] } = boardInfos;
    const visibleNotices = showAllNotices ? boardNotificationList : boardNotificationList.slice(0, 3);

    const handleRowClick = (id) => navigate(`${id}`);

    const renderRows = (list, isNotice = false) =>
        list.map((e) => (
            <tr
                key={e.id}
                className={`hover:bg-base-200 transition cursor-pointer ${
                    isNotice ? "bg-warning/10" : ""
                }`}
                onClick={() => handleRowClick(e.id)}
            >
                <td className="truncate">
                    {isNotice && <span className="mr-2 text-warning font-bold">📌</span>}
                    {e.title}
                    {e.commentCount > 0 && (
                        <span className="text-sm text-base-content/50 ml-1">({e.commentCount})</span>
                    )}
                    {e.fileCount > 0 && (
                        <span className="text-sm text-base-content/50 ml-1">💾</span>
                    )}
                </td>
                <td className="text-center font-medium">{e.name}</td>
                <td className="text-center text-sm text-base-content/50">
                    {timestampToMonthDay(e.createdAt)}
                </td>
                <td className="text-center text-sm">{e.viewCount}</td>
            </tr>
        ));

    return (
        <div className="overflow-auto h-[calc(100vh-300px)] bg-base-100 shadow-lg rounded-xl border border-base-300">
            <table className="table w-full">
                <thead className="bg-base-200 text-base font-semibold">
                <tr>
                    <th className="w-2/3 text-left pl-6 p-2">제목</th>
                    <th className="w-1/6 text-center p-2">작성자</th>
                    <th className="w-1/6 text-center p-2">작성일</th>
                    <th className="w-1/6 text-center pr-6 p-2">조회수</th>
                </tr>
                </thead>
                <tbody>
                {/* 공지글 섹션 */}
                {boardNotificationList.length > 0 && (
                    <>
                        {renderRows(visibleNotices, true)}
                        {boardNotificationList.length > 3 && (
                            <tr>
                                <td colSpan="4" className="text-center bg-base-100 p-1 cursor-pointer hover:bg-base-200 transition"
                                    onClick={() => setShowAllNotices(!showAllNotices)}>
                                    <div
                                        className="text-xs text-base-content btn-base-content"
                                    >
                                        {showAllNotices ? "공지 접기 ▲" : "더보기 ▼"}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </>
                )}

                {/* 일반 게시글 섹션 */}
                {boardList.length > 0 ? (
                    renderRows(boardList)
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center text-base-content-300 py-6">
                            게시글이 없습니다
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
