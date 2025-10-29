import React, {useRef, useState} from "react";
import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko"

import "react-big-calendar/lib/css/react-big-calendar.css";
import AddScheduleModal from "@/components/calendar/AddScheduleModal.jsx";
import useCalendarStore from "@/store/calendar/useCalendarStore.js";
import getContrastColor from "@/utils/calendar/getContrastColor.js";

import './CalendarPage.css';
import WeekendCalenderHeader from "@/components/calendar/WeekendCalenderHeader.jsx";
import useEmployeeStore from "@/store/employeeStore.js";

moment.locale("ko");
const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const {scheduleList, setSelectedSchedule, setNewEvent, modalOpen, setModalOpen} = useCalendarStore();
    const {selectedEmployee} = useEmployeeStore();
    const [currentView, setCurrentView] = useState(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());

    const calendarRef = useRef(null);

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    // 화면 범위 이벤트 계산
    const getVisibleEvents = () => {
        if (!calendarRef.current) return [];

        const range = calendarRef.current.state?.range || {};
        const viewStart = range.startAt || moment(currentDate).startOf("month").subtract(7, "days").toDate();
        const viewEnd = range.endAt || moment(currentDate).endOf("month").add(7, "days").toDate();

        const visibleEvents = [];

        scheduleList.forEach((event) => {
            event.startAt = new Date(event.startAt);
            event.endAt = new Date(event.endAt);

            if (event.recurrence === "none") {
                if (moment(event.endAt) >= viewStart && moment(event.startAt) <= viewEnd) {
                    visibleEvents.push(event);
                }
            } else {
                let tempStart = moment(event.startAt);
                let tempEnd = moment(event.endAt);
                const maxEnd = moment(event.recurrenceEnd || "");

                while (tempStart.isBefore(viewEnd) && tempStart.isBefore(maxEnd)) {
                    if (tempEnd >= viewStart) {
                        visibleEvents.push({...event, startAt: tempStart.toDate(), endAt: tempEnd.toDate()});
                    }

                    switch (event.recurrence) {
                        case "daily":
                            tempStart = tempStart.add(1, "days");
                            tempEnd = tempEnd.add(1, "days");
                            break;
                        case "weekly":
                            tempStart = tempStart.add(1, "weeks");
                            tempEnd = tempEnd.add(1, "weeks");
                            break;
                        case "monthly":
                            tempStart = tempStart.add(1, "months");
                            tempEnd = tempEnd.add(1, "months");
                            break;
                        case "yearly":
                            tempStart = tempStart.add(1, "years");
                            tempEnd = tempEnd.add(1, "years");
                            break;
                        default:
                            tempStart = tempStart.add(1, "days");
                            tempEnd = tempEnd.add(1, "days");
                    }
                }
            }
        });

        return visibleEvents;
    };

    const EventComponent = ({ event }) => (
        <div>
            <div>{event.title}</div>
            <div style={{ fontSize: "0.7em" }}>{event.name}</div>
        </div>
    );

    const handleSelectSlot = ({start, end}) => {
        setNewEvent({title: "", startAt: start, endAt: end, description: "", recurrence: "none", color: "#dddddd"});
        setSelectedSchedule(null);
        setModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        console.log(event);
        setSelectedSchedule(event);
        setNewEvent({...event});
        setModalOpen(true);
    };

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.color || "#dddddd",
            color: getContrastColor(event.color) || "black",
            borderRadius: "4px",
            border: "none",
            padding: "2px",
            cursor: "pointer",
        },
    });

    const CustomToolbar = ({label, onView, onNavigate}) => {
        const btnClass = (view) => `btn btn-sm mr-2 ${currentView === view ? "btn-primary" : "btn-outline"}`;
        return (
            <div className="flex items-center justify-between mb-2">
                <div>
                    <button className={btnClass(Views.MONTH)} onClick={() => {
                        onView(Views.MONTH);
                        setCurrentView(Views.MONTH);
                    }}>월
                    </button>
                    <button className={btnClass(Views.WEEK)} onClick={() => {
                        onView(Views.WEEK);
                        setCurrentView(Views.WEEK);
                    }}>주
                    </button>
                    <button className={btnClass(Views.DAY)} onClick={() => {
                        onView(Views.DAY);
                        setCurrentView(Views.DAY);
                    }}>일
                    </button>
                </div>
                <div className="font-bold">{label}</div>
                <div>
                    <button className="btn btn-outline btn-sm mr-2" onClick={() => onNavigate("PREV")}>◀ 이전</button>
                    <button className="btn btn-outline btn-sm mr-2" onClick={() => onNavigate("NEXT")}>다음 ▶</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setCurrentDate(new Date())}>오늘</button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl bg-base-100">
            <Calendar
                ref={calendarRef}
                localizer={localizer}
                culture="ko"
                events={getVisibleEvents()}
                startAccessor="startAt"
                endAccessor="endAt"
                selectable
                resizable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                components={{
                    month: {header: WeekendCalenderHeader,},
                    week: {header: WeekendCalenderHeader,},
                    toolbar: CustomToolbar,
                    event: EventComponent,
                }}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                style={{height: 700}}
                formats={{
                    weekdayFormat: (date) => weekDays[moment(date).day()],
                    dayFormat: (date) => weekDays[moment(date).day()],
                    monthHeaderFormat: "YYYY년 M월",
                    dayHeaderFormat: "YYYY년 M월 D일 dddd",
                    dayRangeHeaderFormat: ({start, end}, culture, localizer) =>
                        `${localizer.format(start, "M월 D일", culture)} ~ ${localizer.format(end, "M월 D일", culture)}`,
                }}
            />

            <AddScheduleModal open={modalOpen} setModalOpen={setModalOpen}/>
        </div>
    );
}
