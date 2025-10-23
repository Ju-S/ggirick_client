import React, { useState } from "react";
import { Checkbox } from "flowbite-react";
import { Star, StarOff } from "lucide-react";

export default function MailList({ onSelect, selectedMail }) {
  // 임시 데이터
  const mails = [
    { id: 1, sender: "홍길동", email: "hong@example.com", subject: "주간 보고서 전달드립니다.", preview: "이번 주 진행한 프로젝트 요약입니다.", time: "오전 10:30" },
    { id: 2, sender: "김철수", email: "kim@example.com", subject: "회의 일정 조정 요청", preview: "다음 주 화요일 회의 시간 변경 부탁드립니다.", time: "어제" },
    { id: 3, sender: "이영희", email: "lee@example.com", subject: "인사팀 공지사항 안내", preview: "인사 관련 서류 제출 안내드립니다.", time: "10월 20일" },
  ];

  // 별 아이콘 상태
  const [starred, setStarred] = useState({});

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setStarred(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col">
      {mails.map(mail => (
        <div
          key={mail.id}
          onClick={() => onSelect(mail)}
          className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 ${
            selectedMail?.id === mail.id ? "bg-blue-50" : ""
          }`}
        >
          {/* 체크박스 + 보낸사람 */}
          <div className="flex items-center gap-2 w-1/6 min-w-[120px]">
            <Checkbox />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 truncate">{mail.sender}</span>
              <span className="text-gray-400 text-xs truncate">{mail.email}</span>
            </div>
          </div>

          {/* 제목 + 내용 */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-900 truncate">{mail.subject}</span>
            <span className="text-gray-500 truncate">{mail.preview}</span>
          </div>

          {/* 별 + 시간 */}
          <div className="flex items-center gap-3 w-[150px] justify-end">
            <button onClick={(e) => toggleStar(mail.id, e)} className="text-yellow-500 hover:text-yellow-400">
              {starred[mail.id] ? <Star size={18} fill="gold" /> : <StarOff size={18} />}
            </button>
            <span className="text-sm text-gray-500 whitespace-nowrap">{mail.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}