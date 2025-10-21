import { useState } from "react";
import TaskDrawer from "./TaskDrawer.jsx";
import TaskModal from "./TaskModal.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";

export default function TaskClickMenu({ task, contextMenuTaskId, setContextMenuTaskId }) {
  const {
    selectedProject,
    deleteTask, // store에서 삭제 처리
  } = useTaskProjectStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (taskId) => {
    const success = await deleteTask(taskId); // store에서 삭제 및 상태 갱신
    if (success) {
      alert("삭제 완료!");
      setContextMenuTaskId(null);
    }
  };

  const handleEdit = () => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
    setContextMenuTaskId(null);
  };

  const handleDetail = () => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setContextMenuTaskId(null);
  };

  return (
    <>
      {contextMenuTaskId === task.id && (
        <div className="bg-base-100 border-base-300 absolute top-1 right-1 z-10 flex flex-col rounded border p-1 shadow-md">
          <button className="btn btn-xs btn-primary mb-1" onClick={handleDetail}>
            상세보기
          </button>
          <button className="btn btn-xs btn-secondary mb-1" onClick={handleEdit}>
            수정
          </button>
          <button className="btn btn-xs btn-accent mb-1" onClick={() => handleDelete(task.id)}>
            삭제
          </button>
          <button className="btn btn-xs btn-ghost" onClick={() => setContextMenuTaskId(null)}>
            취소
          </button>
        </div>
      )}

      {isModalOpen && (
        <TaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      )}

      {isDrawerOpen && (
        <TaskDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedTask={selectedTask}
          mode="edit"
        />
      )}
    </>
  );
}
