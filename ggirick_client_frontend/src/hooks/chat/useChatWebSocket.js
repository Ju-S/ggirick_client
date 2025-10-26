import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

/**
 * useChatWebSocket
 * 채팅방별 독립 STOMP client hook
 *
 * @param {number|string} workspaceId - 워크스페이스 ID
 * @param {number|string} channelId - 채널 ID
 * @param {(message: any) => void} onMessage - 메시지 수신 콜백
 */
export function useChatWebSocket(workspaceId, channelId, onMessage) {
    const clientRef = useRef(null);

    useEffect(() => {
        if (!workspaceId || !channelId) return;

        const token = sessionStorage.getItem("token");

        const client = new Client({
            brokerURL: "ws://192.168.45.172:8081/ws",
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
            connectHeaders: { Authorization: "Bearer " + token },
        });

        clientRef.current = client;

        client.onConnect = () => {
            console.log(`[STOMP] Connected to workspace ${workspaceId} channel ${channelId}`);

            const topic = `/subscribe/workspace/${workspaceId}/channel/${channelId}`;
            client.subscribe(topic, (msg) => {
                if (!msg.body) return;
                try {
                    const data = JSON.parse(msg.body);
                    onMessage(data);
                } catch (e) {
                    console.error("Failed to parse STOMP message", e);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("[STOMP] Broker error:", frame);
        };

        client.activate();

        // 🟢 수정된 cleanup
        return () => {
            console.log(`[STOMP] Cleanup for channel ${channelId}`);
            // 채널 변경 시에만 해제
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [workspaceId, channelId]); // ✅ onMessage 제거

    //  메시지 전송 함수
    const sendMessage = ({ type, content, parentId, emoji }) => {
        if (!clientRef.current || !clientRef.current.connected) return;


        try{
           const payload = {
               workspaceId:workspaceId,
               channelId:channelId,
               type,
               parentId,
               emoji,
               content: JSON.stringify(content),
               createdAt: new Date()
           };
           console.log("발행 전 페이로드 확인",payload);

           clientRef.current.publish({
               destination: `/send/workspace/${workspaceId}/channel/${channelId}`,
               body: JSON.stringify(payload),
           });
       }catch (e) {
           console.log("에러메시지"+e);
       }


    };

    return { sendMessage };
}
