import { useEffect, useState } from "react";
import SidebarWorkspaces from "../../components/chat/SidebarWorkspaces.jsx";
import SidebarChannels from "../../components/chat/SidebarChannels.jsx";
import SidebarChannelsMobile from "../../components/chat/SidebarChannelsMobile.jsx";
import ChatRoom from "../../components/chat/ChatRoom.jsx";
import useChatStore from "@/store/chat/useChatStore.js";

export default function ChatPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showChannels, setShowChannels] = useState(false);
    const [showWorkspace , setShowWorkspace] = useState(false);

    const {fetchWorkspaces} = useChatStore();

    useEffect(() => {
        fetchWorkspaces();
    }, []);


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen pt-20 md:ml-64 bg-base-200 relative">
            {/* 데스크톱 전용 워크스페이스 + 채널 */}
            {!isMobile && (
                <>
                    <SidebarWorkspaces />
                    <SidebarChannels />
                </>
            )}


            {/* 모바일용 채널 드롭다운 */}
            {isMobile && (
                <div className="absolute top-16 left-0 right-0 z-10 bg-base-100 shadow-lg border-t border-base-300 animate-slide-down">
                    <SidebarChannelsMobile onSelectChannel={() => setShowChannels(false)} />
                </div>
            )}

            {/* 채팅 메인 */}
            <ChatRoom />
        </div>
    );
}
