import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import CustomDrawer from "../../components/common/Drawer.jsx";
import TagsInput from "../../components/common/TagsInput.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";

export default function TaskDrawer({ open, onClose, selectedTask, mode = "create" }) {
  const { projects, setProjects,selectedProject,selectedProjectId, createTask, updateTask } = useTaskProjectStore();
    const today = new Date();
  const [range, setRange] = useState({ from: today, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);

  const [task, setTask] = useState({
    title: "",
    projectId: "",
    assignee: "",
    status: "할 일",
    priority: "medium",
    startedAt: "",
    endedAt: "",
  });

  const [taskData, setTaskData] = useState({ detail: "", file: "", tags: [] });

  useEffect(() => {
    if (!open) return;

    if (selectedTask && mode === "edit") {
      setTask({
        ...selectedTask,
        assignee: selectedTask.assignee || "",
        projectId: selectedTask.projectId || "",
      });

      const parsedData = selectedTask.taskData
        ? JSON.parse(selectedTask.taskData)
        : { detail: "", file: "", tags: [] };
      setTaskData(parsedData);

      setRange({
        from: selectedTask.startedAt ? new Date(selectedTask.startedAt) : undefined,
        to: selectedTask.endedAt ? new Date(selectedTask.endedAt) : undefined,
      });
    } else {
      setTask({
        title: "",
        projectId: selectedProjectId,
        assignee: "",
        status: "할 일",
        priority: "medium",
        startedAt: "",
        endedAt: "",
      });
      setTaskData({ detail: "", file: "", tags: [] });
      setRange({ from: undefined, to: undefined });
    }
  }, [open, selectedTask, mode]);

  const handleChange = (e) => setTask((prev) => (
      { ...prev, [e.target.name]: e.target.value }));
  const handleTaskDataChange = (name, value) => setTaskData((prev) => ({ ...prev, [name]: value }));
    const handleProjectChange = (projectId) => {
        setTask((prev) => ({
            ...prev,
            projectId,
            assignee: "", // 프로젝트 바뀌면 담당자 초기화
        }));

    };
  const handleAssigneeChange = (e) => setTask((prev) => ({ ...prev, assignee: e.target.value }));

  const formatDate = (date) => {
    if (!date) return null;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatRange = () => {
    if (!range.from) return "기간을 선택하세요";
    const fromStr = range.from.toLocaleDateString();
    const toStr = range.to ? range.to.toLocaleDateString() : "";
    return toStr ? `${fromStr} ~ ${toStr}` : `${fromStr} ~ `;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const formatToday = formatDate(today);

    const finalTask = {
      ...task,
      startedAt: range.from ? formatDate(range.from) : formatToday,
      endedAt: range.to ? formatDate(range.to) : formatToday,
      taskData: JSON.stringify(taskData),
    };

    try {
      if (mode === "create") {
        await createTask(finalTask);

        alert("작업이 성공적으로 생성되었습니다!");

      } else if (mode === "edit") {

        await updateTask(selectedTask.id, finalTask);
        alert("작업이 성공적으로 수정되었습니다!");

      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("작업 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <CustomDrawer isOpen={open} onClose={onClose} title="할 일 생성 / 수정">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium mb-1">할 일 제목</label>
          <input
            name="title"
            type="text"
            placeholder="예: API 연동 작업"
            value={task.title}
            onChange={handleChange}
            className="input input-bordered w-full bg-base-100"
          />
        </div>

        {/* 프로젝트 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1">프로젝트</label>
          <select
            name="projectId"
            value={task.projectId || ""}
            className="select select-bordered w-full bg-base-100"
            onChange={(e) => handleProjectChange(Number(e.target.value))}
          >
            <option disabled>프로젝트 선택</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* 담당자 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1">담당자</label>
            <select
                name="assignee"
                value={task.assignee || ""}
                onChange={handleAssigneeChange}
                className="select select-bordered w-full bg-base-100"
            >
                <option disabled value="">
                    담당자 선택
                </option>
                {task.projectId &&
                    projects.find((p) => Number(p.id) === Number(task.projectId))
                        ?.members?.map((member) => (
                        <option key={member.employeeId} value={member.employeeId}>
                            {member.name}
                        </option>
                    ))}
            </select>
        </div>

        {/* 상태 */}
        <div>
          <label className="block text-sm font-medium mb-1">상태</label>
          <select
            name="status"
            value={task.status}
            className="select select-bordered w-full bg-base-100"
            onChange={handleChange}
          >
            <option value="할 일">할 일</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
          </select>
        </div>

        {/* 중요도 */}
        <div>
          <label className="block text-sm font-medium mb-1">중요도</label>
          <select
            name="priority"
            value={task.priority}
            className="select select-bordered w-full bg-base-100"
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* 상세 내용 */}
        <div>
          <label className="block text-sm font-medium mb-1">상세 내용</label>
          <textarea
            name="detail"
            className="textarea textarea-bordered w-full bg-base-100"
            rows="4"
            placeholder="작업 상세 내용을 입력하세요."
            value={taskData.detail}
            onChange={(e) => handleTaskDataChange("detail", e.target.value)}
          ></textarea>
        </div>

        {/* 파일 첨부 */}
        <div>
          <label className="block text-sm font-medium mb-1">파일 첨부 (아직 껍데기)</label>
          {/* 파일 input 수정 */}
          <input
            type="file"
            className="input input-bordered w-full bg-base-100"
            onChange={(e) =>
              handleTaskDataChange("file", e.target.files?.[0]?.name || "")
            }
          />

        </div>

        {/* 태그 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1">태그</label>
          <TagsInput
            value={taskData.tags}
            onChange={(newTags) => handleTaskDataChange("tags", newTags)}
            placeholder="태그 입력 후 Enter"
          />
        </div>

        {/* 날짜 범위 */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">기간 설정</label>
          <button
            type="button"
            className="input input-bordered w-full text-left bg-base-100"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {formatRange()}
          </button>
          {showCalendar && (
            <div className="absolute z-50 mt-2 bg-base-100 shadow-lg rounded-xl border border-base-300">
              <DayPicker
                mode="range"
                defaultMonth={today}
                selected={range}
                onSelect={(selected) => {
                  if (!selected) return; // undefined 보호
                  setRange(selected);

                  // from과 to가 모두 있고 from <= to일 경우만 닫기
                  if (selected.from && selected.to) {
                    setShowCalendar(false);
                  }
                }}

              />
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            저장
          </button>
        </div>
      </form>
    </CustomDrawer>
  );
}
