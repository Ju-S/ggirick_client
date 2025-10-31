import { useState, useMemo } from "react";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import { formatDate } from "@/utils/task/formatDate.js";

export const DatabaseView = () => {
    const { selectedProject } = useTaskProjectStore();

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); // asc / desc
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [statusFilter, setStatusFilter] = useState("전체");
    const [priorityFilter, setPriorityFilter] = useState("전체");

    //  필터 검색 적용
    const filteredTasks = useMemo(() => {
        if (!selectedProject?.tasks) return [];

        return selectedProject.tasks
            .filter(task =>
                (task.title.toLowerCase().includes(search.toLowerCase()) ||
                    (selectedProject.members.find(m => m.employeeId === task.assignee)?.name || "")
                        .toLowerCase()
                        .includes(search.toLowerCase()))
            )
            .filter(task => {
                if (statusFilter === "전체") return true;
                if (statusFilter === "긴급") {
                    const dueDate = new Date(task.endedAt);
                    const today = new Date();
                    return dueDate < today && task.status !== "완료";
                }
                return task.status === statusFilter;
            })
            .filter(task => priorityFilter === "전체" || task.priority === priorityFilter);
    }, [search, selectedProject, statusFilter, priorityFilter]);


    //  정렬 적용
    const sortedTasks = useMemo(() => {
        if (!sortBy) return filteredTasks;
        return [...filteredTasks].sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (sortBy === "startedAt" || sortBy === "endedAt") {
                valA = new Date(valA); valB = new Date(valB);
            } else {
                valA = String(valA).toLowerCase(); valB = String(valB).toLowerCase();
            }

            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            return 0;
        });
    }, [filteredTasks, sortBy, sortOrder]);

    //  페이지네이션
    const paginatedTasks = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedTasks.slice(start, start + pageSize);
    }, [sortedTasks, page]);

    const totalPages = Math.ceil(sortedTasks.length / pageSize);

    //  컬럼 헤더 클릭시 정렬
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* 검색 + 필터 */}
            <div className="flex flex-wrap gap-2">
                <input
                    type="text"
                    placeholder="검색: 업무명 / 담당자"
                    className="input input-bordered flex-1"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered w-32"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    {["전체", "완료", "진행 중", "할 일", "긴급"].map(s => <option key={s}>{s}</option>)}
                </select>

                <select
                    className="select select-bordered w-32"
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                >
                    {["전체", "high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
                </select>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto rounded-lg border border-base-300 shadow-sm">
                <table className="min-w-full text-sm table-auto border-collapse">
                    <thead className="bg-base-200 sticky top-0 z-10">
                    <tr>
                        {["ID", "업무명", "담당자", "상태","시작일", "마감일", "프로젝트", "우선순위"].map((h, idx) => (
                            <th
                                key={idx}
                                className="px-4 py-3 text-left font-semibold text-xs uppercase text-base-content/70 cursor-pointer"
                                onClick={() => handleSort(
                                    h === "시작일" ? "startedAt" :
                                        h === "마감일" ? "endedAt" :
                                            h === "상태" ? "status" :
                                                h === "우선순위" ? "priority" :
                                                    h === "업무명" ? "title" : null
                                )}
                            >
                                {h} {sortBy && (sortBy === "title" && h==="업무명" || sortBy === "status" && h==="상태" || sortBy === "priority" && h==="우선순위" || sortBy === "startedAt" && h==="시작일" || sortBy === "endedAt" && h==="마감일") ? (sortOrder==="asc"?"↑":"↓") : ""}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-base-300">
                    {paginatedTasks.map((task, idx) => {
                        const dueDate = new Date(task.endedAt);
                        const today = new Date();
                        const isOverdue = dueDate < today && task.status !== "완료";

                        return (
                            <tr key={task.id} className="hover:bg-base-100 transition-colors">
                                <td className="px-4 py-2 font-mono text-xs text-base-content/60">{(page-1)*pageSize + idx +1}</td>
                                <td className="px-4 py-2 font-medium">{task.title}</td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-primary-content text-xs font-semibold">
                                            {selectedProject.members.find(m => m.employeeId === task.assignee)?.roleName?.[0] || task.assignee[0]}
                                        </div>
                                        <span className="text-base-content/80">
                        {selectedProject.members.find(m => m.employeeId === task.assignee)?.name || "탈주"}
                      </span>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "완료" ? "bg-success text-success-content" :
                            task.status === "진행 중" ? "bg-info text-info-content" :
                                "bg-neutral text-neutral-content"
                    }`}>
                      {task.status}
                    </span>
                                </td>
                                <td className={`px-4 py-2 ${isOverdue ? "text-error font-bold" : "text-base-content/80"}`}>
                                    {formatDate(task.startedAt)}
                                </td>
                                <td className={`px-4 py-2 ${isOverdue ? "text-error font-bold" : "text-base-content/80"}`}>
                                    {formatDate(dueDate)}
                                </td>
                                <td className="px-4 py-2 text-base-content/70">{selectedProject.name}</td>
                                <td className="px-4 py-2">
                              <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                      isOverdue
                                          ? "bg-error text-error-content"
                                          : task.priority === "높음"
                                              ? "bg-warning text-warning-content"
                                              : task.priority === "중간"
                                                  ? "bg-info text-info-content"
                                                  : "bg-success text-success-content"
                                  }`}
                              >
                                {task.priority}
                              </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}

            <div className="flex justify-end items-center gap-2 mt-2">
                <p>마감일이 지났는데 업무가 진행중인 경우 <span className= "text-error">빨간색 </span>으로 표시됩니다. 또한  <span className= "text-error">긴급</span>으로 필터링해서 모아볼 수 있습니다.</p>
                <button className="btn btn-sm" onClick={()=>setPage(p => Math.max(1, p-1))} disabled={page===1}>이전</button>
                <span> {page} / {totalPages} </span>
                <button className="btn btn-sm" onClick={()=>setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>다음</button>
            </div>
        </div>
    );
};
