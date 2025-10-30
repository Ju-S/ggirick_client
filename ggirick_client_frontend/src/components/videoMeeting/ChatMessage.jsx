export default function ChatMessage({ message, isMine }) {
  return isMine ? (
    <div className="flex justify-end">
      <div className="flex flex-col items-end space-y-1">
        <div className="text-xs font-semibold">{message.sender} <span className="text-gray-400">{message.time}</span></div>
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-primary">{message.text}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-start space-x-2">
      <img src={message.avatar} className="w-6 h-6 rounded-full" alt={message.sender} />
      <div className="flex flex-col space-y-1">
        <div className="text-xs font-semibold">{message.sender} <span className="text-gray-400">{message.time}</span></div>
        <div className="chat chat-start">
          <div className="chat-bubble">{message.text}</div>
        </div>
      </div>
    </div>
  )
}
