import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";

/**
 * useChatWebSocket
 * 워크스페이스 단위 STOMP client 재사용 hook
 *
 * @param {number|string} workspaceId - 워크스페이스 ID
 * @param {number|string} channelId - 채널 ID
 * @param {(message: any) => void} onMessage - 메시지 수신 콜백
 */
export function useChatWebSocket(workspaceId, channelId, onMessage) {
    const clientRef = useRef(null);
    const currentSubscription = useRef(null);

    // 항상 최신 onMessage 참조를 유지
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    // 워크스페이스 클라이언트 초기화
    useEffect(() => {
        if (!workspaceId || clientRef.current) return;

        const token = sessionStorage.getItem("token");
        const client = new Client({
            brokerURL: "ws://10.5.5.1:8081/ws",
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
            connectHeaders: { Authorization: "Bearer " + token },
        });

        client.onConnect = () => {
            console.log(`[STOMP] Connected to workspace ${workspaceId}`);
        };

        client.onStompError = (frame) => {
            console.error("[STOMP] Broker error:", frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [workspaceId]);

    // 채널 subscribe/unsubscribe
    useEffect(() => {
        if (!clientRef.current || !channelId) return;

        if (!clientRef.current.connected) {
            console.warn("WebSocket not connected yet");
            return;
        }

        // 기존 subscribe 해제
        if (currentSubscription.current) {
            currentSubscription.current.unsubscribe();
            currentSubscription.current = null;
        }

        const topic = `/subscribe/workspace/${workspaceId}/channel/${channelId}`;
        currentSubscription.current = clientRef.current.subscribe(topic, (msg) => {
            if (!msg || !msg.body) return;
            try {
                const data = JSON.parse(msg.body);
                if (data) onMessageRef.current(data);
            } catch (e) {
                console.error("Failed to parse STOMP message", e);
            }
        });

        return () => {
            currentSubscription.current?.unsubscribe();
            currentSubscription.current = null;
        };
    }, [workspaceId, channelId]);

    const sendMessage = useCallback(({ type, content, parentId, emoji, senderId, senderName, viewer }) => {

        if (!clientRef.current || !clientRef.current?.connected || !channelId) return;

        const payload = {
            workspaceId,
            channelId,
            senderId,
            senderName,
            type,
            parentId,
            emoji,
            viewer,
            hasFile: Array.isArray(content)
                ? content.some(block => ["audio", "video", "image", "file"].includes(block.type))
                : false,
            content: JSON.stringify(content),
            createdAt: new Date()
        };

        console.log("발행한 페이로드:", payload);

        clientRef.current.publish({
            destination: `/send/workspace/${workspaceId}/channel/${channelId}`,
            body: JSON.stringify(payload),
        });
    }, [workspaceId, channelId]);



    return { sendMessage };
}
