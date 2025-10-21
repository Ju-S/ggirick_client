import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView({
                                       events = [],
                                       onDateSelect,
                                       onEventClick,
                                       onEventDrop,
                                       onDatesSet,
                                       loading = false,
                                       title,
                                     }) {
  const calendarRef = useRef(null);



  if (loading) return <progress className="progress w-full"></progress>;

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <h2 className="card-title mb-4 text-base-content">{title}</h2>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="ko"
        weekends={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events}
        select={onDateSelect}
        eventClick={onEventClick}
        eventChange={onEventDrop}
        eventResize={onEventDrop}

        datesSet={onDatesSet}
      />
    </div>
  );
}
