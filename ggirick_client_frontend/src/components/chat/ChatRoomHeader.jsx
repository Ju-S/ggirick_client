import React, {useMemo, useState} from "react";
import useChatStore from "@/store/chat/useChatStore.js";
import ChannelSettingModal from "@/components/chat/Modal/ChannelSettingModal.jsx";
import ChannelMemberModal from "@/components/chat/Modal/ChannelMemberModal.jsx";
import DeleteConfirmModal from "@/components/chat/Modal/DeleteConfirmModal.jsx";
import chatAPI from "@/api/chat/chatAPI.js";
import ChannelFileDrawer from "@/components/chat/ChannelFileDrawer.jsx";
import {Link} from "react-router-dom";


export default function ChatRoomHeader({sendMessage}) {


    const { selectedChannel, selectedChannelMember,selectedWorkspace, removeChannel,setSelectedChannel, selectedWorkspaceMember,loading, setLoading } = useChatStore();
    const [channelSettingModalOpen, setChannelSettingModalOpen] = useState(false);
    const [channelMemberModalOpen, setChannelMemberModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isFileDrawerOpen, setIsFileDrawerOpen] = useState(false);
    const [channelFiles, setChannelFiles] = useState([]);

    const handleSystemMessage = (text,event) =>{
        sendMessage({type:"system", event: event})
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await chatAPI.deleteChannel(selectedWorkspace.id, selectedChannel.id);
            setShowDeleteModal(false);

            removeChannel(selectedChannel.id); // store에서 삭제
            setSelectedChannel(null);
        } catch (err) {
            console.error("채널 삭제 실패:", err);
            alert("채널 삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const openFileDrawer = async () => {
        if (!selectedChannel || !selectedWorkspace) return;

        setIsFileDrawerOpen(true);

        try {
            const res = await chatAPI.listFiles(selectedWorkspace.id, selectedChannel.id);
            setChannelFiles(res);
        } catch (err) {
            console.error("파일 로딩 실패", err);
        }
    };

    const memberAvatars = useMemo(() => {
        if (!Array.isArray(selectedChannelMember) || selectedChannelMember.length === 0) return null;

        return selectedChannelMember.map((m) => (
            <div
                key={m.id} // index 대신 고유 id
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-semibold border-2 border-base-100 shadow-sm"
            >
                {m.name?.[0] || "?"}
            </div>
        ));
    }, [selectedChannelMember]);


    return (
        <>
            <header className="flex flex-wrap items-center justify-between border-b bg-base-100 p-4 gap-2">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-[120px]">
                        <h2 className="text-lg font-semibold text-base-content truncate">#{selectedChannel.name}</h2>
                        <p className="text-sm text-base-content/60 truncate">{selectedChannel.description}</p>
                    </div>
                    <div className="flex -space-x-2">
                        {memberAvatars || <span className="text-xs opacity-70">멤버 없음</span>}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link to="/videomeeting">
                        <button className="btn bg-accent text-accent-content rounded-full px-4 py-2 text-base transition-all duration-200 ease-in-out sm:px-6 sm:py-3 sm:text-md lg:px-8 lg:py-4 lg:text-lg">
                            📸화상회의
                        </button>
                    </Link>
                    {!(selectedChannel.typeId === 3 || selectedChannel.type === "direct") && (
                    <button className="text-sm text-red-500 hover:underline transition-colors" onClick={()=> setShowDeleteModal(true) }>채널 삭제</button>
                    )}
                    <button className="text-sm text-primary hover:underline transition-colors" onClick={() => setChannelSettingModalOpen(true)}>채널 관리</button>
                    {!(selectedChannel.typeId === 3 || selectedChannel.type === "direct") && (
                        <button className="text-sm text-primary hover:underline transition-colors" onClick={() => setChannelMemberModalOpen(true)}>멤버 관리</button>
                    )}
                    <button className="text-sm text-primary hover:underline transition-colors" onClick={() => setIsFileDrawerOpen(true)}>파일함 열기</button>
                </div>
            </header>
            {/* 채널 설정 모달 */}
            {channelSettingModalOpen&& <ChannelSettingModal
                open={channelSettingModalOpen}
                onClose={() => setChannelSettingModalOpen(false)}
                channel={selectedChannel}
            />}

            {/* 채널 멤버 관리 모달 */}
            { channelMemberModalOpen && <ChannelMemberModal
                open={channelMemberModalOpen}
                onClose={() => setChannelMemberModalOpen(false)}
                channel={selectedChannel}
                channelMembers={selectedChannelMember}
                workspaceMembers={selectedWorkspaceMember}
                sendSystemMessage={handleSystemMessage}
            />


            }
            {showDeleteModal && <DeleteConfirmModal
                open={showDeleteModal}
                title="채널 삭제"
                message={`채널 "${selectedChannel.name}"을(를) 정말 삭제하시겠습니까?`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />}
            {
                <ChannelFileDrawer
                    isOpen={isFileDrawerOpen}
                    onClose={() => setIsFileDrawerOpen(false)}
                    files={channelFiles}
                    workspaceId = {selectedWorkspace.id}
                    channelId = {selectedChannel.id}
                />
            }

        </>
    )

}