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

        //  STOMP client 생성
        const client = new Client({
            brokerURL: "ws://10.5.5.1:8081/ws", // ws 또는 wss 주소
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
            connectHeaders: {
                Authorization: "Bearer " + token
            }
        });

        clientRef.current = client;
        client.onConnect = () => {
            console.log(`[STOMP] Connected to workspace ${workspaceId} channel ${channelId}`);

            //  채널 구독
            const topic = `/subscribe/workspace/${workspaceId}/channel/${channelId}`;
            client.subscribe(topic, (msg) => {

                if (!msg.body) return;
                try {
                    const data = JSON.parse(msg.body);
                    console.log(data);


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

        // Cleanup: 컴포넌트 unmount 시 구독 해제 및 client 종료
        return () => {
            console.log(`[STOMP] Deactivating client for channel ${channelId}`);
            clientRef.current.deactivate();
            clientRef.current = null;
        };
    }, [workspaceId, channelId, onMessage]);

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
