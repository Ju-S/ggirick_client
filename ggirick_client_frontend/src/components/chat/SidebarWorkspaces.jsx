import React, {useEffect, useState} from "react";
import useChatStore from "@/store/chat/useChatStore.js";
import WorkspaceCreateModal from "@/components/chat/WorkspaceCreateModal.jsx";

export default function SidebarWorkspaces() {
    const { workspaces, fetchWorkspaces, selectWorkspace } = useChatStore();
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        fetchWorkspaces();
    }, []);

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
                    onClick={()=>setModalOpen(true)}
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
