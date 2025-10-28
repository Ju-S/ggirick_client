import VideoHeader from "@/components/videoMeeting/VideoHeader.jsx";
import ChatSidebar from "@/components/videoMeeting/ChatSidebaR.jsx";
import VideoFooter from "@/components/videoMeeting/VideoFooter.jsx";
import VideoGrid from "@/components/videoMeeting/VideoGrid.jsx";
import useChatStore from "@/store/chat/useChatStore.js";
import {useVideoMeetingStore} from "@/store/chat/useVideoMeetingStore.js";
import {useEffect} from "react";

export default function VideoMeetingPage({ users = [], messages = [] }) {

    const {selectedWorkspace, selectedChannel, leaveSession,} = useChatStore();

    const { initSession, joinSession } = useVideoMeetingStore();

    useEffect(() => {
        const setup = async () => {
            await initSession();

        };
        setup();
        return leaveSession;
    }, []);


    const sampleUsers = users.length
        ? users
        : Array.from({ length: 5 }).map((_, idx) => ({
            name: `User ${idx + 1}`,
            avatar: `https://flowbite.com/docs/images/people/profile-picture-${(idx % 5) + 1}.jpg`,
        }));

    const sampleMessages = messages.length
        ? messages
        : [
            {
                sender: "Alice",
                avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
                text: "프로젝트는 어떻게 되어가고 있어?",
                time: "10:12 AM",
            },
            {
                sender: "You",
                avatar: "",
                text: "이해했어! 👍",
                time: "10:14 AM",
            },
            {
                sender: "Alice",
                avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
                text: "아니 어떻게 되고 있냐고",
                time: "10:15 AM",
            },
        ];

    return (
        <main className="flex flex-col h-screen pt-20 md:ml-64 bg-base-200">
            {/* 상단 헤더 */}
            <VideoHeader

                />

            {/* 메인 영역 */}
            <div className="flex flex-1 overflow-hidden">
                {/* 비디오 그리드 */}
                <VideoGrid users={sampleUsers} />

                {/* 채팅 사이드바 */}
                <ChatSidebar messages={sampleMessages} />
            </div>

            {/* 하단 제어 */}
            <VideoFooter />
        </main>
    );
}