import {useEffect, useState} from "react";
import {boardListAPI} from "../../api/board/boardAPI.js";

export function useBoardList(currentPage, groupId, searchFilter, searchQuery) {
    const [boardData, setBoardData] = useState({boardList: []});

    useEffect(() => {
        boardListAPI(currentPage, groupId, searchFilter, searchQuery).then(resp => setBoardData(resp.data));
    }, [currentPage, groupId, searchFilter, searchQuery]);

    return boardData;
}