import {timestampToMonthDay} from "../../utils/board/boardDateFormat.js";
import {useNavigate} from "react-router-dom";

export default function BoardList({ boardInfos }) {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto bg-base-100 shadow-lg rounded-xl border border-base-300">
            <table className="table w-full">
                <thead className="bg-base-200 text-base font-semibold">
                <tr>
                    <th className="w-2/3 text-left">제목</th>
                    <th className="w-1/6 text-center">작성자</th>
                    <th className="w-1/6 text-center">작성일</th>
                    <th className="w-1/6 text-center">조회수</th>
                </tr>
                </thead>
                <tbody>
                {boardInfos.boardList.length > 0 ? (
                    boardInfos.boardList.map((e) => (
                        <tr
                            key={e.id}
                            className="hover:bg-base-200 transition cursor-pointer"
                            onClick={() => navigate(`${e.id}`)}
                        >
                            <td className="truncate">{e.title}</td>
                            <td className="text-center font-medium">{e.name}</td>
                            <td className="text-center text-sm text-gray-600">
                                {timestampToMonthDay(e.createdAt)}
                            </td>
                            <td className="text-center text-sm">{e.viewCount}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center text-gray-500 py-6">
                            게시글이 없습니다
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
