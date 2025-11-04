import React, { useState } from "react";
import "flowbite";
import { Checkbox } from "flowbite-react";
import { Star } from "lucide-react";

export default function MailList({ mails, onSelect, selectedMail }) {
  const [selectedIds, setSelectedIds] = useState([]); // 체크박스 선택
  const [starredIds, setStarredIds] = useState([]);   // 별 선택

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleStar = (id) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getPreview = (content, length = 80) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="flex flex-col divide-y overflow-y-auto h-full">
      {mails.length === 0 && (
        <div className="p-4 text-base-content text-center">메일이 없습니다.</div>
      )}

      {mails.map((mail) => (
        <div
          key={mail.id}
          className={`p-3 cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
            selectedMail && selectedMail.id === mail.id ? "bg-gray-200" : ""
          }`}
        >
          {/* 체크박스 */}
          <input
            type="checkbox"
            checked={selectedIds.includes(mail.id)}
            onChange={() => toggleSelect(mail.id)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />

          {/* 별(중요표시) */}
          <Star
            size={18}
            className={`mt-1 cursor-pointer ${
              starredIds.includes(mail.id) ? "text-primary" : "text-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(mail.id);
            }}
          />

          {/* 메일 내용 */}
          <div
            className="flex-1 flex flex-col min-w-0"
            onClick={() => onSelect(mail)}
          >
            {/* 상단: 발신자 + 날짜 */}
            <div className="flex justify-between items-center mb-1 min-w-0">
              <span className="font-medium truncate">{mail.sender}</span>
              <span className="text-base-content text-xs flex-shrink-0">
                {new Date(mail.sentAt).toLocaleString()}
              </span>
            </div>

            {/* 제목 */}
            <div className="font-semibold mb-1 truncate">{mail.title}</div>

            {/* 본문 */}
            <div className="text-base-content text-sm truncate">
              {getPreview(mail.content, 100)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}