import {create} from "zustand";
import {getGroupListAPI} from "@/api/calendar/calendarGroupAPI.js";

const useCalendarGroupStore = create((set) => ({
    list: [],
    loading: false,
    init: async () => {
        set({loading: true});
        const resp = await getGroupListAPI();
        set({list: resp.data, loading: false});
    }
}))

export default useCalendarGroupStore;