import {Button} from "flowbite-react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useBoardList} from "../../hooks/board/useBoardList.js";
import BoardList from "../../components/board/BoardList.jsx";
import Pagination from "../../components/board/Pagination.jsx"

export default function BoardPage() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("currentPage")) || 1;

    const boardInfos = useBoardList(currentPage);

    return (
        <div className="ag-theme-quartz w-full h-100">

            {boardInfos && <>
                <BoardList boardInfos={boardInfos}/>
                <Pagination currentPage={currentPage} totalPage={boardInfos.totalPage}
                            pagePerNav={boardInfos.pagePerNav}/>
            </>
            }
            <button className="btn btn-primary" onClick={() => navigate("/board/posting")}>게시글 쓰기</button>
        </div>
    )

}