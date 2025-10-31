import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { tasksToEvents ,eventToTask} from "@/utils/task/calendarMapper.js"
import { syncEventUpdate, syncEventCreate, syncEventDelete } from "@/utils/task/calendarSync.js";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import TaskModal from "@/components/task/TaskModal.jsx";

export default function FullCalenderView() {
  const { selectedProject } = useTaskProjectStore();
    const [selectedTask, setSelectedTask] = useState(null);
  const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

  const [primaryColor, setPrimaryColor] = useState(""); // daisyUI primary 색 가져오기
   useEffect(() => { const rootStyles = getComputedStyle(document.documentElement);

   const color = rootStyles.getPropertyValue("--pf") || "#3b82f6"; // default primary
     setPrimaryColor(color.trim()); }, []);

  const getPriorityColor = (priority) =>
  { switch (priority) { case "high": return "bg-primary"; case "medium": return "bg-secondary"; case "low": return "bg-accent"; } };

  useEffect(() => {
    console.log(selectedProject.tasks)
    if (selectedProject?.tasks) {
      setEvents(tasksToEvents(selectedProject.tasks));
    }


  }, [selectedProject]);

    const handleDetail = (clickInfo) => {
        const event = clickInfo.event;

        setSelectedTask(eventToTask(event));
        setIsModalOpen(true);
    };


  //   const handleDateSelect = async (selectInfo) => {
  //   const title = prompt("새로운 이벤트 제목:");
  //   if (!title) return;
  //
  //   const newEvent = {
  //     id: String(Date.now()),
  //     title,
  //     start: selectInfo.start,
  //     end: selectInfo.end,
  //     allDay: true,
  //     extendedProps: {
  //       projectId: selectedProject.id,
  //       assignee: "EMP001",
  //       assigner: "EMP001",
  //       logs: "할 일",
  //       priority: "medium",
  //       description: "설명 없음",
  //       file: "",
  //       tags: [],
  //     },
  //   };
  //
  //   setEvents((prev) => [...prev, newEvent]);
  //   await syncEventCreate(newEvent);
  // };

  const handleEventChange = async (changeInfo) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === changeInfo.event.id
          ? { ...evt, start: changeInfo.event.start, end: changeInfo.event.end }
          : evt
      )
    );
    await syncEventUpdate(changeInfo);
  };

  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`'${clickInfo.event.title}' 이벤트를 삭제할까요?`)) {
      setEvents((prev) => prev.filter((evt) => evt.id !== clickInfo.event.id));
      await syncEventDelete(clickInfo.event.id);
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        {selectedProject.title} 📅
      </h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"

        selectable
        editable
        events={events}

        eventClick={handleDetail}
        eventChange={handleEventChange}

        eventContent={(arg) => (
          <div
            className={`text-white px-2 py-1 rounded text-sm font-medium ${getPriorityColor(
              arg.event.extendedProps.priority
            )}`}
            title={`Assignee: ${arg.event.extendedProps.assignee}\nStatus: ${arg.event.extendedProps.logs}`}
          >
            {arg.event.title}
          </div>
        )}
        dayHeaderContent={(day) => (
          <div className="text-primary font-semibold">{day.text}</div>
        )}
        height="800px"
      />
        {isModalOpen && (
            <TaskModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
            />
        )}
    </div>
  );
}
