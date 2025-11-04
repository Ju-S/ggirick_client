import React from "react";
import "flowbite";

import { Inbox, Star, Send, FileText, AlertCircle, Trash2, Mail } from "lucide-react";

export default function MailSidebar({ onSelectFolder,onCompose }) {
  const folders = [
    { id: "all", name: "전체메일함", icon: <Inbox size={16} className="text-primary" /> },
    { id: "inbox", name: "받은메일함", icon: <Mail size={16} className="text-primary"/> },
    { id: "important", name: "중요메일함", icon: <Star size={16} className="text-primary"/> },
    { id: "sent", name: "보낸메일함", icon: <Send size={16} className="text-primary"/> },
    { id: "draft", name: "임시메일함", icon: <FileText size={16} className="text-primary"/> },
    { id: "personal", name: "개인메일함", icon: <Mail size={16} className="text-primary"/> },
    { id: "spam", name: "스팸메일함", icon: <AlertCircle size={16} className="text-primary"/> },
    { id: "trash", name: "휴지통", icon: <Trash2 size={16} className="text-primary"/> },
  ];

  return (
    <div className="w-64 bg-base-100 border-r border-gray-200 h-full flex flex-col gap-2 p-4 rounded-lg shadow-sm">
      {/* 글쓰기 버튼 */}
      <div className="p-4 border-b border-gray-200">
        <div className="border-b p-2">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2 ">
            <Inbox size={25} className="text-primary"/> Mail
          </h2>
        </div>
        <button className="btn btn-primary w-full mt-3" onClick={onCompose}>
          메일 쓰기
        </button>
      </div>

      {/* 메일함 리스트 */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <h3 className="mb-2 text-xs text-base-content uppercase">Channels</h3>
        <ul className="space-y-1">
          {folders.map(folder => (
            <li key={folder.id} className="rounded px-3 py-2 hover:bg-gray-100">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => onSelectFolder(folder.id)}
              >
                <div className="flex items-center gap-2">
                  {folder.icon}
                  <span>{folder.name}</span>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-primary px-3 py-2 text-center text-xs font-medium text-white"
                >
                  {/* 여기 숫자는 예시, 나중에 데이터 바인딩 */}
                  0
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}