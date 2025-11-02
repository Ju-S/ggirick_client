import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import TaskClickMenu from "../TaskClickMenu.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import {getTagsFromTask} from "@/utils/task/getTagsFromTask.js";

export default function KanbanView() {
  const {
    selectedProject,
    updateTaskStatus,
    setSelectedProject,
  } = useTaskProjectStore();

  const [contextMenuTaskId, setContextMenuTaskId] = useState(null);

  if (!selectedProject) return <div className="p-6">프로젝트 선택</div>;

  const getColumns = (tasks) => ({
    "할 일": tasks.filter((t) => t.status === "할 일"),
    "진행 중": tasks.filter((t) => t.status === "진행 중"),
    "완료": tasks.filter((t) => t.status === "완료"),
  });

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const updatedTasks = selectedProject.tasks.map((task) =>
      String(task.id) === result.draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );

    setSelectedProject({ ...selectedProject, tasks: updatedTasks });


    try {
      const movedTask = updatedTasks.find((t) => String(t.id) === result.draggableId);
      await updateTaskStatus(movedTask.id, movedTask.status);
    } catch (err) {
      console.error("업데이트 실패, 롤백", err);

      setSelectedProject(selectedProject);
    }
  };

  const columns = getColumns(selectedProject.tasks);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Object.entries(columns).map(([col, colTasks]) => (
          <Droppable key={col} droppableId={col}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`border-base-300 rounded-lg border p-2 sm:p-4 transition-colors ${
                  snapshot.isDraggingOver ? "bg-primary/10" : "bg-base-200"
                }`}
              >
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    col === "완료"
                      ? "bg-success text-success-content"
                      : col === "진행 중"
                        ? "bg-info text-info-content"
                        : "bg-neutral text-neutral-content"
                  }`}
                >
                  {col} | {colTasks.length}
                </span>

                <div className="min-h-[100px] space-y-3">
                  {colTasks.map((task, index) => (

                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`border-base-300 relative cursor-pointer rounded-lg border p-3 shadow-sm transition-all ${
                            snapshot.isDragging ? "bg-primary text-primary-content" : "bg-base-100 hover:bg-primary/10"
                          }`}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenuTaskId(task.id);
                          }}
                        >
                          <p className="text-xs sm:text-sm font-medium">{task.title}</p>

                          <div className="text-base-content/70 mt-1 flex items-center justify-between text-xs">
                            <div>
                              {selectedProject.members.find((m) => m.employeeId === task.assignee)?.name || "사용자가 없거나 탈주했습니다"}

                            </div>

                            <span>{task.startedAt} ~ {task.endedAt}</span>

                          </div>


                          <TaskClickMenu
                            task={task}
                            contextMenuTaskId={contextMenuTaskId}
                            setContextMenuTaskId={setContextMenuTaskId}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
