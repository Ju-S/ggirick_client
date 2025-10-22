import React, { useState } from "react";
import ChatInput from "./ChatInput";
import "@blocknote/mantine/style.css";
import {Message} from "@/components/chat/Message.jsx";


export default function ChatRoom() {
  const [messages, setMessages] = useState([
    {
        id:1001,
        senderId: 1,
      senderName: "Alice",
      type:"user",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "헤이, " }] },
        { type: "paragraph", content: [{ type: "text", text: "프로젝트 진행이 얼마나 되었어 bro!" }] },
      ],
      time: "10:12 AM",
      like:3,
      viewer:["Alice","Bob","Chocolate","Dab"],
        reactions: [
            { emoji: "👍", users: ["Bob", "Chocolate"] },
            { emoji: "🔥", users: ["Dab"] },
        ],
    },
    { id:1002,
        senderId: 2,
      type: "user",
        senderName: "You", content: [
        { type: "paragraph", content: [{ type: "text", text: "나는 능이버섯이다 🍄" }] },

      ],
      time: "10:14 AM",
        viewer:["Alice","Bob","Chocolate","Dab"],
        like:0,
      isMine: true },
    {id:1003,
        senderId: 1,
        senderName: "Alice",
      type:"user",
      content: [
        { type: "heading", content: [{ type: "text", text: "헤이 헤이!" }] },
      ],
      time: "10:15 AM",
      like:7,  viewer:["Alice","Bob","Chocolate"],
    },
    {  id: 1004,
        type: "system",
        subtype: "user_left",
        text: "Charlie님이 채팅에서 나갔습니다.",
        time: "10:15 AM",
        relatedUsers: ["Charlie"],
        relatedChannel: "general",
        metadata: {
            reason: "inactive",
            roleChanged: "admin",
         }
        },
  ]);

  const handleSendMessage = (newContent) => {
    const newMessage = {
        senderId: 2,
      sender: "You",
      type:"user",
      content: newContent,
        like:0,
        viewer:[],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

    const handleAddReaction = (messageId, emoji) => {
        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== messageId) return msg;

                // 이미 존재하는 반응인지 확인
                const existing = msg.reactions?.find((r) => r.emoji === emoji);
                if (existing) {
                    // 이미 있으면 users에 추가 (중복 방지)
                    return {
                        ...msg,
                        reactions: msg.reactions.map((r) =>
                            r.emoji === emoji
                                ? {
                                    ...r,
                                    users: [...new Set([...r.users, "You"])],
                                }
                                : r
                        ),
                    };
                }
                console.log(messages)

                // 새 반응 추가
                return {
                    ...msg,
                    reactions: [...(msg.reactions || []), { emoji, users: ["You"] }],
                };
            })
        );
    };

  return (
    <main className="flex flex-1 flex-col bg-base-200 text-base-content">
      <header className="flex items-center justify-between  bg-primary p-4">
        <div>
          <h2 className="text-lg font-semibold text-primary-content"># general</h2>
          <p className="text-sm text-primary-content/60">일반 대화방입니다</p>
        </div>
          <button className="text-sm text-primary-content hover:underline">
              View Members
          </button>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          msg.type === "user" ? (
            <div>
              <div className="flex items-start space-x-3">
                <img
                  src={`https://flowbite.com/docs/images/people/profile-picture-${msg.senderId}.jpg`}
                  className="h-8 w-8 rounded-full"
                  alt={msg.senderName}
                />
                <Message key={msg.id}
                         msg={msg}
                         like={msg.like}
                         viewer={msg.viewer}
                         reactions ={ msg.reactions}
                         onAddReaction={handleAddReaction}/>

              </div>

            </div>
          ):(
            <div
              key={msg.id}
              className="text-center text-xs text-base-content/50 italic"
            >
              {msg.text}
            </div>
          )

        ))}
      </div>

      {/* 채팅 입력창 */}
      <ChatInput onSend={handleSendMessage} />
    </main>
  );
}
