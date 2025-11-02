import VideoHeader from "@/components/videoMeeting/VideoHeader.jsx";
import ChatSidebar from "@/components/videoMeeting/ChatSidebar.jsx";
import VideoFooter from "@/components/videoMeeting/VideoFooter.jsx";
import VideoGrid from "@/components/videoMeeting/VideoGrid.jsx";
import useChatStore from "@/store/chat/useChatStore.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLivekitStore } from "@/store/chat/useLivekitStore.js";
import { useShallow } from "zustand/react/shallow";

export default function VideoMeetingPage() {
    const { selectedWorkspace, selectedChannel } = useChatStore();
    const navigate = useNavigate();
    const [isChatSidebarOpen, setChatSidebarOpen] = useState(false);

    // Livekit store 중 필요한 부분만 구독
    const { joinRoom, leaveRoom } = useLivekitStore(
        useShallow((state) => ({
            joinRoom: state.joinRoom,
            leaveRoom: state.leaveRoom,
        }))
    );

    // 비디오 관련 상태만 별도로 구독
    const { localVideoTrack, localAudioTrack, remoteTracks } = useLivekitStore(
        useShallow((state) => ({
            localVideoTrack: state.localVideoTrack,
            localAudioTrack: state.localAudioTrack,
            remoteTracks: state.remoteTracks,
        }))
    );

    // 채널이나 워크스페이스 없으면 리디렉션
    useEffect(() => {
        if (!selectedChannel || !selectedWorkspace) {
            navigate("/chat");
            return;
        }

        const init = async () => {
            await joinRoom(`${selectedChannel.id}_${selectedWorkspace.id}`);
        };
        init();

        return () => {
            leaveRoom();
        };
    }, [selectedChannel, selectedWorkspace]);

    const handleChatSidebar = () => {
        setChatSidebarOpen((prev) => !prev);
    };

    return (
        <main className="flex flex-col h-screen pt-20 md:ml-64 bg-base-200">
            <VideoHeader />

            <div className="flex flex-1 overflow-hidden">
                <VideoGrid
                    localVideoTrack={localVideoTrack}
                    localAudioTrack={localAudioTrack}
                    remoteTracks={remoteTracks}
                />

                {isChatSidebarOpen && <ChatSidebar />}
            </div>

            <VideoFooter handleChatSidebar={handleChatSidebar} />
        </main>
    );
}
