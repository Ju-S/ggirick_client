import SidebarWorkspaces from "../../components/chat/SidebarWorkspaces.jsx";
import SidebarChannels from "../../components/chat//SidebarChannels.jsx";
import ChatRoom from "../../components/chat/ChatRoom.jsx";

export default function ChatPage() {
  return(
    <div className="flex h-screen  pt-20 md:ml-64 bg-base-200">
      {/* 워크스페이스 사이드바 */}
      <SidebarWorkspaces />

      {/* 채널 사이드바 */}
      <SidebarChannels />

      {/* 채팅 메인 */}
      <ChatRoom />
    </div>
  );
}
