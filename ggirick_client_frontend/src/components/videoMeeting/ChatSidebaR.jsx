import ChatMessage from "./ChatMessage";

export default function ChatSidebar({ messages }) {
  return (
    <aside className="w-80 bg-base-100 border-l p-4 flex flex-col">
      <h2 className="font-semibold mb-2">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-2 p-2">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} isMine={msg.sender === "You"} />
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지 입력..."
        className="input input-bordered w-full mt-2"
      />
    </aside>
  )
}
