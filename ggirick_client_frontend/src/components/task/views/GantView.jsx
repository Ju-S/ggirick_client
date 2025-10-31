import { useState } from "react";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";

export default function GanttView() {
    const { selectedProject } = useTaskProjectStore();
    const [showCompleted, setShowCompleted] = useState(false);

    if (!selectedProject?.tasks) return null;

    const getGanttData = (tasks) => {
        return tasks.map((task) => {
            const dueDate = new Date(task.endedAt);
            const today = new Date();
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return { ...task, daysLeft: diffDays };
        });
    };

    const ganttTasks = getGanttData(selectedProject.tasks);

    // 완료 여부 기준 정렬: 완료된 작업은 맨 아래
    const incompleteTasks = ganttTasks.filter(t => t.status !== "완료");
    const completedTasks = ganttTasks.filter(t => t.status === "완료");

    return (
        <div className="p-4 bg-base-200 min-h-[calc(100vh-10rem)] transition-colors duration-300">
            <div className="bg-base-100 rounded-lg border border-base-300 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6 text-primary">📊 간트 차트</h3>
                <div className="space-y-4">
                    {/* 미완료 작업 먼저 렌더링 */}
                    {incompleteTasks.map((task) => <GanttTask key={task.id} task={task} selectedProject={selectedProject} />)}

                    {/* 완료 작업 접기/펼치기 */}
                    {completedTasks.length > 0 && (
                        <div>
                            <button
                                className="btn btn-outline btn-sm mb-2"
                                onClick={() => setShowCompleted(!showCompleted)}
                            >
                                {showCompleted ? "완료 작업 접기" : `완료 작업 보기 (${completedTasks.length})`}
                            </button>
                            {showCompleted && completedTasks.map((task) => (
                                <GanttTask key={task.id} task={task} selectedProject={selectedProject} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// 개별 Task 컴포넌트로 분리
function GanttTask({ task, selectedProject }) {
    const progress =
        task.status === "완료" ? 100 : task.logs === "진행 중" ? 50 : 0;
    const isOverdue = task.daysLeft < 0;
    const isUrgent = task.daysLeft >= 0 && task.daysLeft < 3;

    const progressColor =
        progress === 100
            ? "bg-success"
            : progress === 50
                ? "bg-info"
                : "bg-base-300";

    const ddayColor = isOverdue
        ? "text-error"
        : isUrgent
            ? "text-warning"
            : "text-success";

    return (
        <div
            className="border border-base-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-base-100"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <p className="font-medium text-base-content">{task.title}</p>
                    <p className="text-sm text-base-content/70 mt-1">
                        {selectedProject.members.find((m) => m.employeeId === task.assignee)?.name || "사용자가 없거나 탈주했습니다"}
                    </p>
                </div>
                <div className="text-right ml-4">
                    <p className="text-sm text-info mb-1">{task.due}</p>
                    <p className={`text-sm font-semibold ${ddayColor}`}>
                        {isOverdue ? `${Math.abs(task.daysLeft)}일 지연` : `D-${task.daysLeft}`}
                    </p>
                </div>
            </div>
            <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-xs text-base-content/70">{task.logs}</span>
                <span className="text-xs font-medium text-base-content">{progress}%</span>
            </div>
        </div>
    );
}
