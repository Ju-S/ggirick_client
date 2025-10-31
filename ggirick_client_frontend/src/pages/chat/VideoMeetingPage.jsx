import VideoHeader from "@/components/videoMeeting/VideoHeader.jsx";
import ChatSidebar from "@/components/videoMeeting/ChatSidebar.jsx";
import VideoFooter from "@/components/videoMeeting/VideoFooter.jsx";
import VideoGrid from "@/components/videoMeeting/VideoGrid.jsx";
import { Room } from 'livekit-client';
import useChatStore from "@/store/chat/useChatStore.js";
import {useVideoMeetingStore} from "@/store/chat/useVideoMeetingStore.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import api from "@/api/common/apiInterceptor.js";
import {useLivekitStore} from "@/store/chat/useLivekitStore.js";
import {useStore} from "zustand/react";


export default function VideoMeetingPage({ users = [], messages = [] }) {

    const {selectedWorkspace, selectedChannel} = useChatStore();
    const navigator = useNavigate();
    const [isChatSidebarOpen, setChatSidebarOpen] = useState(false);


    if(selectedChannel == null || selectedWorkspace == null){
        navigator("/chat")
    }


    const { joinRoom, room, localVideoTrack, remoteTracks ,leaveRoom} = useLivekitStore();

    useEffect(() => {
        if (!selectedChannel || !selectedWorkspace) {
            navigator("/chat");
            return;
        }

        const init = async () => {
            await joinRoom(`${selectedChannel.id}_${selectedWorkspace.id}`);
        };
        init();

        return () => {
            leaveRoom(); // cleanup 시 안전하게 호출
        };
    }, [selectedChannel, selectedWorkspace]);


    const handleChatSidebar =  () => {
        if(isChatSidebarOpen){
            setChatSidebarOpen(false);
        }else{
            setChatSidebarOpen(true);
        }
    }


    return (
        <main className="flex flex-col h-screen pt-20 md:ml-64 bg-base-200">
            {/* 상단 헤더 */}
            <VideoHeader

                />

            {/* 메인 영역 */}
            <div className="flex flex-1 overflow-hidden">
                {/* 비디오 그리드 */}
                <VideoGrid
                    localVideoTrack={localVideoTrack}
                    remoteTracks={remoteTracks}
                />

                {/* 채팅 사이드바 */}
                {
                    isChatSidebarOpen && (<ChatSidebar />)

                }

            </div>

            {/* 하단 제어 */}
            <VideoFooter handleChatSidebar = {handleChatSidebar}/>
        </main>
    );
}