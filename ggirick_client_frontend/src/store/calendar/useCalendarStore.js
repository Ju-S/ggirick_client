import {create} from "zustand";
import {getCalendarListAPI} from "@/api/calendar/calendarGroupAPI.js";
import {getListAPI} from "@/api/calendar/calendarAPI.js";

const useCalendarStore = create((set) => ({
    scheduleList: [],
    newEvent: {},
    modalOpen: false,
    selectedSchedule: null,
    initCalendar: (groupId = null) => {
        if(groupId) {
            getCalendarListAPI(groupId).then(resp => set({scheduleList: resp.data}));
        } else {
            getListAPI().then(resp => set({scheduleList: resp.data}));
        }
    },
    setSelectedSchedule: (schedule) => {
        set({selectedSchedule: schedule});
    },
    setNewEvent: (schedule) => {
        set({newEvent: schedule});
    },
    setModalOpen: (flag) => {
        set({modalOpen: flag});
    }
}));

export default useCalendarStore;