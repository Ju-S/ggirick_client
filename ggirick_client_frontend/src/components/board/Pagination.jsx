import {useNavigate} from "react-router-dom";

export default function Pagination({ currentPage, pagePerNav, totalPage }) {
    const navigate = useNavigate();

    const currentBlock = Math.ceil(currentPage / pagePerNav);
    const startPage = (currentBlock - 1) * pagePerNav + 1;
    let endPage = currentBlock * pagePerNav;
    if (endPage > totalPage) endPage = totalPage;

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="join">
            {startPage > 1 && (
                <button
                    className="join-item btn"
                    onClick={() => navigate(`?currentPage=${startPage - 1}`)}
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
                    onClick={() => navigate(`?currentPage=${num}`)}
                >
                    {num}
                </button>
            ))}

            {endPage < totalPage && (
                <button
                    className="join-item btn"
                    onClick={() => navigate(`?currentPage=${endPage + 1}`)}
                >
                    »
                </button>
            )}
        </div>
    );
}
