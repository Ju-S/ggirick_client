import {timestampToMonthDay} from "../../utils/board/boardDateFormat.js";
import {useNavigate} from "react-router-dom";

export default function BoardList({boardInfos}) {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead>
                <tr>
                    <th>작성자</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
                </thead>
                <tbody>
                {boardInfos &&
                    boardInfos.boardList.map(e => (
                        <tr onClick={() => navigate(`${e.id}`)}>
                            <td>{e.name}</td>
                            <td>{e.title}</td>
                            <td>{timestampToMonthDay(e.createdAt)}</td>
                            <td>{e.viewCount}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}