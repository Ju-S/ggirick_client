import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("ko");
const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const [events, setEvents] = useState([
        { id: 1, title: "회의", contents: "내용", start: new Date(), end: new Date(), recurrence: "none", color: "#4ade80" },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", contents: "", start: null, end: null, recurrence: "none", color: "#4ade80" });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentView, setCurrentView] = useState(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());

    const calendarRef = useRef(null);

    // 화면 범위 이벤트 계산
    const getVisibleEvents = () => {
        if (!calendarRef.current) return [];

        const range = calendarRef.current.state?.range || {};
        const viewStart = range.start || moment(currentDate).startOf("month").toDate();
        const viewEnd = range.end || moment(currentDate).endOf("month").toDate();

        const visibleEvents = [];

        events.forEach((event) => {
            if (event.recurrence === "none") {
                if (event.end >= viewStart && event.start <= viewEnd) visibleEvents.push(event);
            } else {
                let tempStart = moment(event.start);
                let tempEnd = moment(event.end);
                const maxEnd = moment().add(20, "years");

                while (tempStart.isBefore(viewEnd) && tempStart.isBefore(maxEnd)) {
                    if (tempEnd >= viewStart) {
                        visibleEvents.push({ ...event, start: tempStart.toDate(), end: tempEnd.toDate() });
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

    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({ title: "", start, end, contents: "", recurrence: "none", color: "#4ade80" });
        setSelectedEvent(null);
        setModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setNewEvent({ ...event });
        setModalOpen(true);
    };

    const handleSaveEvent = () => {
        if (!newEvent.title) return;
        const eventToSave = { ...newEvent, id: selectedEvent ? selectedEvent.id : events.length + 1 };

        if (selectedEvent) {
            setEvents(events.filter((e) => e.id !== selectedEvent.id).concat(eventToSave));
        } else {
            setEvents([...events, eventToSave]);
        }

        setModalOpen(false);
        setSelectedEvent(null);
        setNewEvent({ title: "", start: null, end: null, contents: "", recurrence: "none", color: "#4ade80" });
    };

    const handleDeleteEvent = (all = false) => {
        if (!selectedEvent) return;

        if (all && selectedEvent.recurrence !== "none") {
            setEvents(events.filter((e) => e.id !== selectedEvent.id));
        } else {
            setEvents(events.filter((e) => e.id !== selectedEvent.id));
        }

        setModalOpen(false);
        setSelectedEvent(null);
    };

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.color || "#4ade80",
            color: "black",
            borderRadius: "4px",
            border: "none",
            padding: "2px",
            cursor: "pointer",
        },
    });

    const CustomToolbar = ({ label, onView, onNavigate }) => {
        const btnClass = (view) => `btn btn-sm mr-2 ${currentView === view ? "btn-primary" : "btn-outline"}`;
        return (
            <div className="flex items-center justify-between mb-2">
                <div>
                    <button className={btnClass(Views.MONTH)} onClick={() => { onView(Views.MONTH); setCurrentView(Views.MONTH); }}>월</button>
                    <button className={btnClass(Views.WEEK)} onClick={() => { onView(Views.WEEK); setCurrentView(Views.WEEK); }}>주</button>
                    <button className={btnClass(Views.DAY)} onClick={() => { onView(Views.DAY); setCurrentView(Views.DAY); }}>일</button>
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
        <div className="p-6 max-w-7xl">
            <Calendar
                ref={calendarRef}
                localizer={localizer}
                events={getVisibleEvents()}
                startAccessor="start"
                endAccessor="end"
                selectable
                resizable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                components={{ toolbar: CustomToolbar }}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                style={{ height: 600 }}
            />

            {/* DaisyUI Modal */}
            {modalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setModalOpen(false)}>✕</button>

                        <h3 className="text-lg font-bold mb-4">{selectedEvent ? "일정 수정" : "일정 추가"}</h3>

                        <input type="text" placeholder="일정 제목" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="input input-bordered w-full mb-2" />

                        {/* 날짜/시간 직접 입력 */}
                        <div className="flex gap-2 mb-2">
                            <input type="datetime-local" value={newEvent.start ? moment(newEvent.start).format("YYYY-MM-DDTHH:mm") : ""} onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })} className="input input-bordered w-1/2" />
                            <input type="datetime-local" value={newEvent.end ? moment(newEvent.end).format("YYYY-MM-DDTHH:mm") : ""} onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })} className="input input-bordered w-1/2" />
                        </div>

                        <input type="text" placeholder="내용" value={newEvent.contents} onChange={(e) => setNewEvent({ ...newEvent, contents: e.target.value })} className="input input-bordered w-full mb-2" />

                        {/* 색상 선택 */}
                        <div className="mb-2">
                            <label className="block mb-1 font-semibold">이벤트 색상 선택</label>
                            <input type="color" value={newEvent.color} onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })} className="w-full h-10 p-0 border-0" />
                        </div>

                        {/* 반복 */}
                        <select className="select select-bordered w-full mb-2" value={newEvent.recurrence} onChange={(e) => setNewEvent({ ...newEvent, recurrence: e.target.value })}>
                            <option value="none">반복 없음</option>
                            <option value="daily">매일</option>
                            <option value="weekly">매주</option>
                            <option value="monthly">매월</option>
                            <option value="yearly">매년</option>
                        </select>

                        <button className="btn btn-primary w-full" onClick={handleSaveEvent}>{selectedEvent ? "수정" : "추가"}</button>

                        {selectedEvent && (
                            <>
                                <button className="btn btn-error w-full mt-2" onClick={() => handleDeleteEvent(false)}>삭제 (한 번)</button>
                                {selectedEvent.recurrence !== "none" && <button className="btn btn-error w-full mt-2" onClick={() => handleDeleteEvent(true)}>삭제 (전체 반복)</button>}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
