import {Button} from "flowbite-react";
import {useNavigate, useParams} from "react-router";
import {useBoardItem} from "../../hooks/board/useBoardItem.js";
import {timestampToMonthDay} from "../../utils/board/boardDateFormat.js";

export default function BoardDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {boardDetail} = useBoardItem(id);

    return (
        <div>
            {boardDetail && (
                <div className="card w-full bg-base-100 shadow-xl p-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span className="badge badge-outline">작성자: {boardDetail.name}</span>
                        <span className="badge badge-outline">작성일: {timestampToMonthDay(boardDetail.createdAt)}</span>
                        <span className="badge badge-outline">조회수: {boardDetail.viewCount}</span>
                    </div>

                    <h2 className="text-xl font-bold mb-3">{boardDetail.title}</h2>

                    <div className="prose max-w-full whitespace-pre-wrap">
                        {boardDetail.contents}
                    </div>
                </div>
            )}

            <Button onClick={() => navigate("/board")}>게시판리스트로</Button>
        </div>
    );
}