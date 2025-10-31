export function safeParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}

export function taskToEvent(task) {
  const data = safeParseJSON(task.task_data);

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
      logs: task.logs,
      priority: task.priority,
      description: data.detail || "",
      file: data.file || "",
      tags: data.tags || [],
    },
  };
}

export function eventToTask(event) {
  return {
    id: Number(event.id),
    projectId: event.extendedProps.projectId,
    title: event.title,
    assignee: event.extendedProps.assignee || "미정",
    assigner: event.extendedProps.assigner || "",
    logs: event.extendedProps.logs || "할 일",
    priority: event.extendedProps.priority || "low",
    startedAt: event.start instanceof Date ? event.start.toLocaleDateString("en-CA"): event.start,
    endedAt: event.end instanceof Date ? event.end.toLocaleDateString("en-CA"): event.end,
    taskData: JSON.stringify({
      detail: event.extendedProps.description || "",
      file: event.extendedProps.file || "",
      tags: event.extendedProps.tags || [],
    }),
  };
}

export const tasksToEvents = (tasks = []) => tasks.map(taskToEvent);
export const eventsToTasks = (events = []) => events.map(eventToTask);