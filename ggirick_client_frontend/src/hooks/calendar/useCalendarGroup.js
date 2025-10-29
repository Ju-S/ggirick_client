import {useEffect, useState} from "react";
import {getGroupListAPI} from "@/api/calendar/calendarGroupAPI.js";

export default function useCalendarGroup() {
    const [groupList, setGroupList] = useState([]);

    useEffect(() => {
        getGroupListAPI().then(resp => setGroupList(resp.data));
    }, []);

    return groupList;
}