export default function VideoFooter() {
  return (
    <footer className="p-4 bg-base-100 shadow">
      <div className="flex justify-between items-center">
        <div className="flex flex-1 justify-center space-x-2">
          <button className="btn btn-outline">🎤 마이크</button>
          <button className="btn btn-outline">📷 카메라</button>
          <button className="btn btn-outline">🖥️ 화면공유</button>
          <button className="btn btn-warning">🖖 손들기</button>
          <button className="btn btn-error">🚪 떠나기</button>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">👥 참가자</button>
          <button className="btn btn-outline">💬 채팅</button>
        </div>
      </div>
    </footer>
  )
}
