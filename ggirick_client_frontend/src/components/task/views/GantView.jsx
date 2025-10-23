import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";

export default function GanttView() {
  const { selectedProject } = useTaskProjectStore();

  const getGanttData = (tasks) => {
    return tasks.map((task) => {
      const dueDate = new Date(task.endedAt);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return { ...task, daysLeft: diffDays };
    });
  };

  const ganttTasks = getGanttData(selectedProject.tasks);

  return (
    <div className="p-4 bg-base-200 min-h-[calc(100vh-10rem)] transition-colors duration-300">
      <div className="bg-base-100 rounded-lg border border-base-300 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 text-primary">📊 간트 차트</h3>
        <div className="space-y-4">
          {ganttTasks.map((task) => {
            const progress =
              task.logs === "완료" ? 100 : task.logs === "진행 중" ? 50 : 0;
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
                key={task.id}
                className="border border-base-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-base-100"
              >
                <div className="flex justify-between items-start mb-3">
                  {/* Task Info */}
                  <div className="flex-1">
                    <p className="font-medium text-base-content">{task.title}</p>
                    <p className="text-sm text-base-content/70 mt-1"> <div>    {selectedProject.members.find((m) => m.employeeId === task.assignee)?.name || "사용자가 없거나 탈주했습니다"
                    }</div></p>
                  </div>

                  {/* Due Info */}
                  <div className="text-right ml-4">
                    <p className="text-sm text-info mb-1">{task.due}</p>
                    <p className={`text-sm text-error font-semibold ${ddayColor}`}>
                      {isOverdue
                        ? `${Math.abs(task.daysLeft)}일 지연`
                        : `D-${task.daysLeft}`}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Status Info */}
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-base-content/70">{task.logs}</span>
                  <span className="text-xs font-medium text-base-content">
                    {progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
