import {Button} from "flowbite-react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useBoardList} from "../../hooks/board/useBoardList.js";
import BoardList from "../../components/board/BoardList.jsx";
import Pagination from "../../components/board/Pagination.jsx"

export default function BoardPage() {
    const navigate = useNavigate();
    const boardInfos = useBoardList();

    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("currentPage")) || 1;

    return (
        <div className="ag-theme-quartz w-full h-100">

            {boardInfos && <>
                <BoardList boardInfos={boardInfos}/>
                <Pagination currentPage={currentPage} totalPage={boardInfos.totalPage}
                            pagePerNav={boardInfos.pagePerNav}/>
            </>
            }

            <Button onClick={() => navigate("/board/1")}>게시판 아이템으로</Button>
            <Button onClick={() => navigate("/board/posting")}>게시글 쓰기</Button>
        </div>
    )

}