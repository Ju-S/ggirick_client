import { useVideoMeetingStore } from "@/store/chat/useVideoMeetingStore.js";
import useChatStore from "@/store/chat/useChatStore.js";
import {useNavigate} from "react-router";

export default function VideoHeader() {

    const {selectedWorkspace, selectedChannel} = useChatStore();

    const navigate = useNavigate(); // ✅ useNavigate는 최상단에서 호출

    // 만약 workspace도 channel도 선택되지 않은 상태라면 /chat으로 이동
    if (selectedWorkspace == null || selectedChannel == null) {
        navigate("/chat");
        return null; // 렌더링 중단
    }
    return (

    <header className="flex items-center justify-between p-4 bg-base-100 shadow">
      <h1 className="text-lg font-semibold">
          {selectedWorkspace.name} |  {selectedChannel?.name}
      </h1>
      <div className="flex items-center space-x-2">
        <button className="btn btn-ghost btn-sm">Participants</button>
        <button className="btn btn-ghost btn-sm">Chat</button>
      </div>
    </header>
  )
}
