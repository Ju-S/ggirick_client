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
    const handleVideoMeetingPage  = () => {

        if(!selectedWorkspace || !selectedChannel) return;


    }


    return (
        <>
            <header className="flex items-center justify-between border-b bg-base-100 p-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-content">#{selectedChannel.name}</h2>
                        <p className="text-sm text-base-content/60">{selectedChannel.description}</p>
                    </div>
                    <div className="flex -space-x-2">
                        {memberAvatars || <span className="text-xs opacity-70">멤버 없음</span>}
                    </div>
                </div>

                <div className=" flex items-center space-x-4">
                    <Link to="/videomeeting">
                        <button
                            onClick={handleVideoMeetingPage}
                            className={`btn btn-lg bg-accent text-accent-content rounded-full hidden md:inline-flex`}
                        >
                            📸화상회의
                        </button>
                    </Link>
                    <button
                        className="text-sm text-red-500 hover:underline transition-colors"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        채널 삭제
                    </button>

                    <button
                        onClick={() => setChannelSettingModalOpen(true)}
                        className="text-sm text-primary hover:underline transition-colors"
                    >
                        채널 관리
                    </button>
                    {!(selectedChannel.typeId === 3 || selectedChannel.type === "direct") && (
                        <button
                            onClick={() => setChannelMemberModalOpen(true)}
                            className="text-sm text-primary hover:underline transition-colors"
                        >
                            멤버 관리
                        </button>
                    )}
                    <button
                        onClick={() =>  setIsFileDrawerOpen(true)}
                        className="text-sm text-primary hover:underline transition-colors"
                    >
                       파일함 열기
                    </button>
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