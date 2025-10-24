import React, {useCallback, useEffect, useRef} from "react";
import ChatInput from "./ChatInput";
import {Message} from "@/components/chat/Message.jsx";
import useChatStore from "../../store/chat/useChatStore.js";
import { debounce } from "lodash";
import {useChatWebSocket} from "@/hooks/chat/useChatWebSocket.js";

export default function ChatRoom() {

    const {
        messages,
        loading,
        setLoading,
        addMessage,
        selectedWorkspace,
        selectedChannel,
        selectedChannelMember,
        fetchOldMessages,
        hasMoreMessages
    } = useChatStore();


    //역무한 스크롤 감지용
    const containerRef = useRef(null);
    const topRef = useRef(null);
    const bottomRef = useRef(null);

    const { sendMessage } = useChatWebSocket(
        selectedWorkspace?.id,
        selectedChannel?.id,
        (msg) => addMessage(msg)
    );



    useEffect(() => {
        if (!containerRef.current || messages.length === 0) return;

        const lastReadId = sessionStorage.getItem(`lastRead_${selectedChannel.id}`);
        if (lastReadId) {
            const node = containerRef.current.querySelector(`[data-msg-id="${lastReadId}"]`);
            if (node) {
                node.scrollIntoView({ behavior: "auto" });
            }
        } else {
            // 처음 입장 → 맨 아래로
            bottomRef.current.scrollIntoView({ behavior: "auto" });
        }

    }, [messages, selectedChannel]);


    const loadOlderMessages = async () => {
        if (loading ||  !hasMoreMessages) return;
        setLoading(true);

        const container = containerRef.current;
        const oldScrollHeight = container.scrollHeight;

        await fetchOldMessages(); // zustand 함수

        // 스크롤 위치 유지
        container.scrollTop = container.scrollHeight - oldScrollHeight;

        setLoading(false);
    };

    const handleIntersect = useCallback(
        debounce((entries) => {
            console.log("위에 닿음")
            if (entries[0].isIntersecting && !loading) {
                loadOlderMessages();
            }
        }, 300),
        [loadOlderMessages, loading]
    );

    useEffect(() => {
        if (!containerRef.current || !topRef.current) return;

        const observer = new IntersectionObserver(handleIntersect, {
            root: containerRef.current,
            threshold: 0.1,
        });

        observer.observe(topRef.current);

        return () => observer.disconnect();
    }, [handleIntersect]);


    const handleScroll = () => {
        if (!containerRef.current) return;
        const messagesNodes = containerRef.current.querySelectorAll("[data-msg-id]");
        let lastVisibleId = null;

        for (let node of messagesNodes) {
            const rect = node.getBoundingClientRect();
            if (rect.top < containerRef.current.getBoundingClientRect().bottom) {
                lastVisibleId = node.dataset.msgId;
            }
        }

        if (lastVisibleId) {
            sessionStorage.setItem(`lastRead_${selectedChannel.id}`, lastVisibleId);
        }
    };

    if (!selectedWorkspace|| !selectedChannel) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                워크스페이스와 채널을 선택해주세요.
            </div>
        );
    }


    return (
        <main className="flex flex-1 flex-col bg-base-200 text-base-content">
            {/* 메시지 영역 */}
            <div  ref={containerRef}
                  onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-4">
                <div ref={topRef}></div> {/* 맨 위 감지용 */}
                {/* 로딩 컴포넌트 */}
                {loading && messages.length === 0 && (
                    <div className="abosolute inset-0 flex items-center justify-center bg-base-200 z-50">

                        <progress className="progress w-56 progress-primary" value="40" max="100"></progress>
                    </div>
                )}
                {/* 로딩 컴포넌트 */}
                {loading && (
                    <div className="text-center py-4 text-gray-500 flex-none sticky top-0 bg-base-100 border-b border-base-200">
                        <svg className="animate-spin h-5 w-5 text-primary-500 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        이전 메시지를 불러오는 중...
                    </div>
                )}
                {!hasMoreMessages && (
                    <div className="text-center text-sm text-base-content-100">
                        더 불러올 메시지가 없습니다.
                    </div>
                )}

                {messages.map((msg) =>
                    msg.type === "user" ? (
                        <div key={msg.id} data-msg-id={msg.id} className="flex items-start space-x-3">
                            <img
                                src={
                                    selectedChannelMember.find(
                                        (member) => member.employeeId === msg.senderId
                                    )?.profileUrl || "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
                                }
                                className="h-8 w-8 rounded-full"
                                alt={msg.senderName}
                            />
                            <Message
                                msg={msg}
                                like={msg.like}
                                viewer={msg.viewer}
                                reactions={msg.reactions}
                                sendMessage={sendMessage}
                            />
                        </div>
                    ) : (
                        <div
                            key={msg.id}
                            className="text-center text-xs text-base-content/50 italic"
                        >
                            {msg.text}
                        </div>
                    )
                )}
                <div ref={bottomRef}></div>
            </div>

            {/* 입력창 */}
            <ChatInput onSend={sendMessage}   />
        </main>
    );
}