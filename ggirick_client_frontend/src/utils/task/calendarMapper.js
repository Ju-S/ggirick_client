export function safeParseJSON(jsonString) {
    try {
        if (!jsonString) return {};
        return typeof jsonString === "object" ? jsonString : JSON.parse(jsonString);
    } catch {
        return {};
    }
}



export function taskToEvent(task) {
    const data = safeParseJSON(task.task_data || task.taskData || "{}");

    const file = typeof data.file === "string" ? safeParseJSON(data.file) : data.file;
    const tags = typeof data.tags === "string" ? safeParseJSON(data.tags) : data.tags;

    return {
        id: String(task.id),
        title: task.title,
        start: task.startedAt,
        end: task.endedAt,
        allDay: true,
        extendedProps: {
            projectId: task.projectId,
            assignee: task.assignee,
            assigner: task.assigner,
            status: task.status,
            priority: task.priority,
            description: data.detail || "",
            file: file || "",
            tags: tags || [],
        },
    };
}

export function eventToTask(event) {

    const formatToKoreanDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const koreaTime = new Date(d.getTime() + 9 * 60 * 60 * 1000);
        return koreaTime.toISOString().split("T")[0];
    };
    return {
        id: Number(event.id),
        projectId: event.extendedProps.projectId,
        title: event.title,
        assignee: event.extendedProps.assignee || "미정",
        assigner: event.extendedProps.assigner || "",
        status: event.extendedProps.status || "할 일",
        priority: event.extendedProps.priority || "low",
        startedAt: formatToKoreanDate(event.start),
        endedAt: formatToKoreanDate(event.end),
        taskData: JSON.stringify({
            detail: event.extendedProps.description || "",
            file: event.extendedProps.file || "",
            tags: event.extendedProps.tags || [],
        }),
    };
}

export const tasksToEvents = (tasks = []) => tasks.map(taskToEvent);
export const eventsToTasks = (events = []) => events.map(eventToTask);
