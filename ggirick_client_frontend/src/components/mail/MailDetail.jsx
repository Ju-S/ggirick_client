import React from "react";
import "flowbite";
import { ArrowLeft } from "lucide-react";

export default function MailDetail({ mail, onBack }) {
  if (!mail) return <div className="p-4 text-base-content">메일을 선택하세요.</div>;

  return (
    <div className="p-4">
      <button className="mb-2 text-sm text-base-content" onClick={onBack}>
        &larr; 뒤로
      </button>
      <h2 className="text-lg font-bold">{mail.title}</h2>
      <p className="text-sm text-base-content">보낸 사람: {mail.sender}</p>
      <p className="text-sm text-base-content">받은 날짜: {new Date(mail.sentAt).toLocaleString()}</p>
      <hr className="my-2" />
      <div
        className="prose max-w-full text-base-content"
        dangerouslySetInnerHTML={{ __html: mail.content }}
      />
    </div>
  );
}