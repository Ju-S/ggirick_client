import { useNavigate, useSearchParams } from "react-router-dom";
import { useBoardList } from "@/hooks/board/useBoardList.js";
import BoardList from "@/components/board/BoardList.jsx";
import Pagination from "@/components/board/Pagination.jsx";
import BoardLayout from "@/pages/board/BoardLayout.jsx";

export default function BoardPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("currentPage")) || 1;
    const boardInfos = useBoardList(currentPage);

    return (
        <BoardLayout>
            <div className="space-y-4">
                {boardInfos && (
                    <>
                        <BoardList boardInfos={boardInfos} />
                        <Pagination
                            currentPage={currentPage}
                            totalPage={boardInfos.totalPage}
                            pagePerNav={boardInfos.pagePerNav}
                        />
                    </>
                )}
            </div>
        </BoardLayout>
    );
}
