import {useEffect, useState} from "react";
import {itemAPI} from "../../api/board/boardAPI.js";

export function useBoardItem(boardId) {
    const [boardData, setBoardData] = useState({boardList: []});

    useEffect(() => {
        itemAPI(boardId).then(resp => setBoardData(resp.data));
    }, [boardId]);

    return boardData;
}