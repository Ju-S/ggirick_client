import { useState, useMemo } from "react";
import TaskClickMenu from "../TaskClickMenu.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import { formatDate } from "@/utils/task/formatDate.js";
import {getTagsFromTask} from "@/utils/task/getTagsFromTask.js";

export default function TableView() {
    const { selectedProject } = useTaskProjectStore();
    const [contextMenuTaskId, setContextMenuTaskId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTasks = useMemo(() => {
        if (!selectedProject?.tasks) return [];
        return selectedProject.tasks.filter((task) => {
            const titleMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const tags = getTagsFromTask(task);
            const tagMatch = tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return titleMatch || tagMatch;
        });
    }, [selectedProject, searchTerm]);

    return (
        <div className="bg-base-100 rounded-lg border border-base-300 shadow-sm p-4 relative">
            {/* 🔍 검색창 */}
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-base-content">업무 목록</h2>
                <input
                    type="text"
                    placeholder="업무명 또는 태그 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered input-sm w-64"
                />
            </div>

            {/* 📋 테이블 */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-base-200 text-base-content/70 uppercase">
                    <tr>
                        <th className="px-6 py-3">업무명</th>
                        <th className="px-6 py-3">담당자</th>
                        <th className="px-6 py-3">상태</th>
                        <th className="px-6 py-3">기한</th>
                        <th className="px-6 py-3">태그</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredTasks.map((task) => {
                        const tags = getTagsFromTask(task);
                        return (
                            <tr
                                key={task.id}
                                className="border-t border-base-300 hover:bg-base-200 transition-colors relative"
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setContextMenuTaskId(task.id);
                                }}
                            >
                                <td className="px-6 py-3 text-base-content">{task.title}</td>

                                <td className="px-6 py-3 text-base-content/90">
                                    {selectedProject.members.find((m) => m.employeeId === task.assignee)?.name ||
                                        "사용자가 없거나 탈주했습니다"}
                                </td>

                                <td className="px-6 py-3">
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === "완료"
                                ? "bg-success text-success-content"
                                : task.status === "진행 중"
                                    ? "bg-info text-info-content"
                                    : "bg-neutral text-neutral-content"
                        }`}
                    >
                      {task.status}
                    </span>
                                </td>

                                <td className="px-6 py-3 text-base-content/80">
                                    {formatDate(task.endedAt)}
                                </td>

                                {/* 🏷️ 태그 표시 */}
                                <td className="px-6 py-3 space-x-2">
                                    {tags.length > 0 ? (
                                        tags.map((tag, idx) => {
                                            const tagColors = [
                                                "primary",
                                                "secondary",
                                                "accent",

                                            ];
                                            const color = tagColors[idx % tagColors.length]; // 인덱스 기반 순환

                                            return (
                                                <span
                                                    key={idx}
                                                    className={`inline-block bg-${color} text-${color}-content text-xs font-medium px-2 py-1 rounded`}
                                                >
          #{tag}
        </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-base-content text-xs">태그 없음</span>
                                    )}
                                </td>

                                <TaskClickMenu
                                    task={task}
                                    contextMenuTaskId={contextMenuTaskId}
                                    setContextMenuTaskId={setContextMenuTaskId}
                                />
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* 🚫 검색 결과 없음 */}
                {filteredTasks.length === 0 && (
                    <div className="text-center text-base-content/70 py-6">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
