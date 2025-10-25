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
                    <div
                        key={ws.id}
                        className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center cursor-pointer mb-2"
                        onClick={() => selectWorkspace(ws)}
                    >
                        {ws.name[0]}
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
