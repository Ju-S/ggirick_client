import {useEffect, useState} from "react";
import useApprovalDocType from "@/hooks/approval/useApprovalDocType.js";
import useCalendarGroup from "@/hooks/calendar/useCalendarGroup.js";
import {boardGroupListAPI} from "@/api/board/boardGroupAPI.js";

const useRecentActivitiesInfo = () => {
    // 일정 그룹 이름
    const calendarGroupList = useCalendarGroup();
    // 결재기안 문서 종류
    const docTypeList = useApprovalDocType();
    // 게시판 그룹 목록
    const [boardGroupList, setBoardGroupList] = useState([]);

    useEffect(() => {
        const initInfos = async () => {
            const boardGroupResp = await boardGroupListAPI();
            setBoardGroupList(boardGroupResp.data);
        }
        initInfos();
    }, []);

    return ({
        calendarGroupList: calendarGroupList,
        docTypeList: docTypeList,
        boardGroupList: boardGroupList,
    })
}

export default useRecentActivitiesInfo;