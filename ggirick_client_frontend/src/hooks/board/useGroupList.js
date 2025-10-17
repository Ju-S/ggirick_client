import {useState} from "react";

export function useGroupList() {
    const [boardData, setBoardData] = useState({boardList: []});

    const temp = [
        {name: "전사게시판", value: 1},
        {name: "그룹게시판", value: 2},
        {name: "우리팀게시판", value: 3},
    ]

    return temp;
}