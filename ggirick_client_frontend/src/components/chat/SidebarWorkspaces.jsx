import React, {useEffect, useState} from "react";
import useChatStore from "@/store/chat/useChatStore.js";
import WorkspaceCreateModal from "@/components/chat/Modal/WorkspaceCreateModal.jsx";

export default function SidebarWorkspaces() {
    const { workspaces, fetchWorkspaces, selectWorkspace } = useChatStore();
    const [modalOpen, setModalOpen] = useState(false);
    const MAX_WORKSPACES = 10;



    useEffect(() => {
        fetchWorkspaces();
    }, []);

    function handleCreateWorkspace() {
        if (workspaces.length >= MAX_WORKSPACES) {
            alert(`워크스페이스는 최대 ${MAX_WORKSPACES}개까지만 생성할 수 있습니다.`);
            return;
        }
        setModalOpen(true);
    }

    return (
        <>
            <aside className="w-20 bg-base-200 flex flex-col items-center py-4">
                {workspaces.map((ws) => (
                    <div key={ws.id} className="relative group">
                        {/* 원형 아이콘 */}
                        <div
                            className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center cursor-pointer mb-2"
                            onClick={() => selectWorkspace(ws)}
                        >
                            {ws.name[0]}
                        </div>

                        {/* 툴팁 */}
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                    px-2 py-1 rounded bg-secondary text-secondary-content text-xs whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none z-10">
                            {ws.name}
                        </div>
                    </div>
                ))}

                <div
                    className="w-10 h-10 rounded-full bg-accent text-accent-content flex items-center justify-center cursor-pointer mb-2"
                    onClick={()=> {
                        handleCreateWorkspace()
                    }}
                >
                    +
                </div>
            </aside>
            <WorkspaceCreateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}
