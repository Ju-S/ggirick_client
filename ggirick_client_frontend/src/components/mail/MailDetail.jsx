import React from "react";
import { ArrowLeft } from "lucide-react";

export default function MailDetail({ mail, onBack }) {
  if (!mail) return <div className="p-4 text-gray-500">메일을 선택하세요.</div>;

  return (
    <div className="flex flex-col h-full">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-4 p-4 border-b bg-gray-50">
        <button onClick={onBack} className="btn btn-sm btn-ghost flex items-center gap-1">
          <ArrowLeft size={16} /> 뒤로
        </button>
        <h2 className="font-semibold text-lg truncate">{mail.subject}</h2>
      </div>

      {/* 본문 영역 스크롤 가능 */}
      <div className="overflow-y-auto p-4 flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">보낸사람:</span>
            <span>{mail.sender} &lt;{mail.email}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">받는사람:</span>
            <span>나 자신 &lt;me@example.com&gt;</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>2025년 10월 23일 (목) 10시 14분</span>
          </div>
        </div>

        <hr />

        <div className="text-gray-700">
          <p>{mail.preview} (본문 예시)</p>
          <p>여기에 실제 메일 본문 내용을 보여줄 수 있습니다. 서버에서 데이터를 가져와서 렌더링 예정입니다.</p>
          <p>여러 줄의 내용도 스크롤 가능하게 구현되어 있습니다.</p>
        </div>
      </div>
    </div>
  );
}