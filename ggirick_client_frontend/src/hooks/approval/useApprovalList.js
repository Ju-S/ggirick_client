import {useEffect, useState} from "react";
import {getListAPI} from "@/api/approval/approvalAPI.js";

export function useApprovalList(currentPage, box, searchFilter, searchQuery) {
    const [approvalData, setApprovalData] = useState({approvalList: []});

    useEffect(() => {
        getListAPI(currentPage, box, searchFilter, searchQuery).then(resp => setApprovalData(resp.data));
    }, [currentPage, box, searchFilter, searchQuery]);

    return approvalData;
}