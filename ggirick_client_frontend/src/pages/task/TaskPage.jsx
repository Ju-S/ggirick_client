import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import { useEffect } from "react";
import KanbanView from "@/components/task/views/KanbanView.jsx";
import { DatabaseView } from "@/components/task/views/DatabaseView.jsx";
import TableView from "@/components/task/views/TableView.jsx";
import GanttView from "@/components/task/views/GantView.jsx";
import TaskDrawer from "@/components/task/TaskDrawer.jsx";
import FullCalenderView from "@/components/task/views/FullCalenderView.jsx";
import ProjectCreateModal from "@/components/task/ProjectCreateModal.jsx";
import ProjectAddMemberModal from "@/components/task/ProjectAddMemberModal.jsx";
import ProjectInfoModal from "@/components/task/ProjectInfoModal.jsx";
export default function TaskPage() {
    const {
        projects,
        setProjects,
        setSelectedProject,
        selectedProject,
        selectedProjectId,
        setSelectedProjectId,
        activeView,
        setActiveView,
        drawerOpen,
        setDrawerOpen,
        fetchProjects,
        isLoading,
        setLoading,
        error,
        isProjectModalOpen,
        setProjectModalOpen,
        addMemberModalOpen,
        setAddMemberModalOpen, projectInfoModalOpen,
        setProjectInfoModalOpen,
        updateProject
    } = useTaskProjectStore();

    // 🔹 프로젝트 목록 불러오기
    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                await fetchProjects();
            } catch (err) {
                console.error("프로젝트 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    //  프로젝트 선택 갱신
    useEffect(() => {
        if (Array.isArray(projects) && projects.length > 0) {
            // selectedProjectId가 아직 없으면 첫 번째 프로젝트를 자동 선택
            if (selectedProjectId == null) {
                console.log(" selectedProjectId가 아직 없으면 첫 번째 프로젝트를 자동 선택")
                const firstProject = projects[0];
                setSelectedProjectId(firstProject.id);
                setSelectedProject(firstProject);
            } else {
                console.log("선택한 프로젝트를 설정")
                const project = projects.find(p => String(p.id) === String(selectedProjectId)) || null;
                setSelectedProject(project);
                console.log(project);
            }
        }
    }, [projects, selectedProjectId]);

    const projectOptions = Array.isArray(projects) ? projects : [];

    // 🔹 로딩 상태
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-500">
                프로젝트 데이터를 불러오는 중입니다...
            </div>
        );
    }

    if (!selectedProject) {
        return <div className="flex h-screen items-center justify-center text-gray-400">프로젝트를 선택 중입니다...</div>;
    }

    // 🔹 에러 상태
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    // 🔹 프로젝트가 없는 경우
    if (projectOptions.length === 0) {
        return (
            <>
                <main className="flex flex-col h-screen bg-base-100 pt-20 md:ml-64">
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div>등록된 프로젝트가 없습니다. 새 프로젝트를 생성해주세요.</div>
                        <button
                            className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm hover:bg-primary/80"
                            onClick={() => setProjectModalOpen(true)}
                        >
                            + 새 프로젝트
                        </button>
                    </div>
                </main>

                {/* ✅ 항상 최상단에 모달 유지 */}
                <ProjectCreateModal
                    open={isProjectModalOpen}
                    onClose={() => setProjectModalOpen(false)}
                />
            </>
        );
    }


    // 🔹 뷰 렌더링 함수
    const renderView = () => {
        switch (activeView) {
            case "kanban":
                return <KanbanView />;
            case "table":
                return <TableView />;
            case "calendar":
                return <FullCalenderView />;
            case "database":
                return <DatabaseView />;
            case "gantt":
                return <GanttView />;
            default:
                return (
                    <div className="p-6 text-gray-400 text-center h-96 flex items-center justify-center">
                        (선택된 뷰 표시)
                    </div>
                );
        }
    };

    // 🔹 메인 렌더링
    return (
        <>
            <main className="flex flex-col h-screen bg-base-100 pt-20 md:ml-64 transition-colors duration-300">
                {/* 🔹 프로젝트 헤더 */}
                <header className="bg-primary text-primary-content border-b border-base-300 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold" onClick={() => setProjectInfoModalOpen(true)}>{selectedProject.name}</h1>
                            <p className="text-sm opacity-80 mt-1">{selectedProject.description}</p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"

                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="font-medium">{selectedProject.range || "기간 미정"}</span>
                            </div>

                            <div className="flex -space-x-2">
                                {Array.isArray(selectedProject.members) && selectedProject.members.length > 0 ? (
                                    selectedProject.members.map((m, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-semibold border-2 border-base-100 shadow-sm"
                                        >
                                            {m.name?.[0] || "?"}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs opacity-70">멤버 없음</span>
                                )}
                            </div>

                            <button
                                className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm hover:bg-primary/80"
                                onClick={() => setProjectModalOpen(true)}
                            >
                                + 새 프로젝트
                            </button>
                            <button
                                className="px-4 py-2 bg-secondary text-secondary-content rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors shadow-sm"
                                onClick={() => setAddMemberModalOpen(true)}
                            >
                                + 멤버 추가
                            </button>
                            <button
                                className="px-4 py-2 bg-secondary text-secondary-content rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors shadow-sm"
                                onClick={() => setDrawerOpen(true)}
                            >
                                + 새 할 일
                            </button>

                            <TaskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
                        </div>
                    </div>
                </header>

                {/* 🔹 프로젝트 선택 및 뷰 전환 */}
                <div className="p-4 bg-base-100 border-b border-base-300 flex items-center justify-between">
                    <select
                        value={selectedProjectId || ""}
                        onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                        className="border border-base-300 bg-base-100 rounded-md text-sm px-2 py-1"
                    >
                        {projectOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-wrap gap-2">
                        {[
                            ["kanban", "칸반"],
                            ["table", "테이블"],
                            ["gantt", "간트"],
                            ["calendar", "캘린더"],
                            ["database", "DB"],
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveView(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${activeView === key
                                    ? "bg-accent text-accent-content shadow-md"
                                    : "bg-base-100 hover:bg-base-200 border border-base-300"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🔹 메인 콘텐츠 */}
                <section className="flex-1 overflow-y-auto p-4">{renderView()}</section>
            </main>

            {/* ✅ 항상 최상단에 모달 유지 */}
            <ProjectCreateModal
                open={isProjectModalOpen}
                onClose={() => setProjectModalOpen(false)}
            />

            <ProjectAddMemberModal
                open={addMemberModalOpen}
                onClose={() => setAddMemberModalOpen(false)}
                projectId={selectedProject.id}
            />
            <ProjectInfoModal
                open={projectInfoModalOpen}
                onClose={() => setProjectInfoModalOpen(false)}
                project={selectedProject}

            />
        </>
    );
}
