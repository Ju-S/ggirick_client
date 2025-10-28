import {getDoctypeAPI} from "@/api/approval/approvalDoctypeAPI.js";
import {useEffect, useState} from "react";

export default function useApprovalDocType() {
    const [docTypeList, setDocTypeList] = useState([]);

    const fetchData = () => {
        getDoctypeAPI().then(resp => setDocTypeList(resp.data));
    }

    useEffect(() => {
        fetchData();
    }, []);

    return docTypeList;
}