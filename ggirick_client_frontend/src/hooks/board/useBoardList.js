import {useEffect, useState} from "react";
import {boardListAPI} from "../../api/board/boardAPI.js";

export function useBoardList(currentPage=1, searchQuery='') {
    const [boardData, setBoardData] = useState({boardList: []});

    useEffect(() => {
        boardListAPI(currentPage, searchQuery).then(resp => setBoardData(resp.data));
    }, [currentPage, searchQuery]);

    return boardData;
}