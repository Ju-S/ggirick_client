import { useState, useEffect } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";

export default function ProjectInfoModal({ open, onClose, project, }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { updateProject,setProjects,setSelectedProject,projects} = useTaskProjectStore();

    useEffect(() => {
        if (project) {
            setTitle(project.name);
            setDescription(project.description || "");
        }
    }, [project]);

    const handleSave = async () => {
        if (!project) return;

        await updateProject(project.id,  {
            name:title,
            description
        });

        const updatedProject = { ...project, name: title, description };
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);
        onClose();
    };

    return (
        <BaseModal isOpen={open} onClose={onClose} title="프로젝트 정보">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 resize-none"
                    />
                </div>
                <div>
                    <p>프로젝트 주인: { project.createdByEmployeeName}</p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
