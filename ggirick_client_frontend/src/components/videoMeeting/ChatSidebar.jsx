
import ChatInput from "@/components/chat/ChatInput";
import React, {useEffect, useMemo, useRef, useState} from "react";
import useChatStore from "@/store/chat/useChatStore.js";
import {useLivekitStore} from "@/store/chat/useLivekitStore.js";
import {Message} from "@/components/chat/Message.jsx";

export default function ChatSidebar() {
    const {

        selectedWorkspace,
        selectedChannel,
        selectedChannelMember,
        selectedWorkspaceMember,

    } = useChatStore();

    const {messages, sendMessage} = useLivekitStore();
    const prevMessagesLength = useRef(0);


    const containerRef = useRef(null);
    const topRef = useRef(null);
    const bottomRef = useRef(null);

    const memberMap = useMemo(() => {
        const map = new Map();
        selectedWorkspaceMember.forEach(m => map.set(m.employeeId, m));
        return map;
    }, [selectedWorkspaceMember]);

    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            bottomRef.current.scrollIntoView({ behavior: "instant" });
        }
        prevMessagesLength.current = messages.length;
    }, [messages.length]);


    return (
        <aside className="w-80 bg-base-100 border-l p-4 flex flex-col">
            <h2 className="font-semibold mb-2">Chat</h2>
            <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                <div ref={topRef}></div>

                {messages.map(msg => {
                    if (msg.type === "user") {
                        return (
                            <div key={msg.id} data-msg-id={msg.id} className="flex items-start space-x-3">
                                <img
                                    src={
                                        memberMap.get(msg.senderId)?.profileUrl ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName || "User")}&background=random`
                                    }
                                    className="h-8 w-8 rounded-full"
                                    alt={msg.senderName || "Unknown"}
                                />
                                <Message
                                    key={msg.id}
                                    msg={msg}
                                    sendMessage={sendMessage}
                                    chatroom={false}
                                />
                            </div>
                        );
                    } else {
                        let contentText = "";
                        try {
                            const parsed = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
                            contentText = parsed.text || msg.content;
                        } catch(e) {
                            contentText = msg.content;
                        }

                        return (
                            <div key={msg.id} className="text-center text-xs text-base-content/50 italic">
                                {contentText}
                                <div className="text-[10px] text-gray-400">
                                    {msg.time}
                                </div>
                            </div>
                        );
                    }
                })}


                <div ref={bottomRef}></div>
            </div>
           <ChatInput onSend={sendMessage} />
        </aside>
    )
}