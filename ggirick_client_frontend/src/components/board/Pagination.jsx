import {useNavigate} from "react-router-dom";

export default function Pagination({ currentPage, groupId, searchQuery, searchFilter, pagePerNav, totalPage }) {
    const navigate = useNavigate();

    const currentBlock = Math.ceil(currentPage / pagePerNav);
    const startPage = (currentBlock - 1) * pagePerNav + 1;
    let endPage = currentBlock * pagePerNav;
    if (endPage > totalPage) endPage = totalPage;

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    let pageParams = `&groupId=${groupId}`;
    if(searchQuery !== '')pageParams+=`&searchFilter=${searchFilter}&searchQuery=${searchQuery}`;

    return (
        <div className="join">
            {startPage > 1 && (
                <button
                    className="join-item btn"
                    onClick={() => navigate(`?currentPage=${startPage - 1}` + pageParams)}
                >
                    «
                </button>
            )}

            {pageNumbers.map((num) => (
                <button
                    key={num}
                    className={`join-item btn ${
                        num === currentPage ? "btn-active" : ""
                    }`}
                    onClick={() => navigate(`?currentPage=${num}` + pageParams)}
                >
                    {num}
                </button>
            ))}

            {endPage < totalPage && (
                <button
                    className="join-item btn"
                    onClick={() => navigate(`?currentPage=${endPage + 1}` + pageParams)}
                >
                    »
                </button>
            )}
        </div>
    );
}
