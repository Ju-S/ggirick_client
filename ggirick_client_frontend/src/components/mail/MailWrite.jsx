import React, { useState } from "react";
import { TextInput, Button, FileInput } from "flowbite-react";
import { Editor } from "@tinymce/tinymce-react";
import MailAddressModal from "@/components/mail/MailAddressModal.jsx";
import axios from "axios";
import { sendMailAPI } from "@/api/mail/mailAPI.jsx";

const MailWrite = ({ userId }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sendAt, setSendAt] = useState(""); // 예약발송 시간
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState("to");

  // 메일 전송
  const handleSend = () => {
    const formData = new FormData();
    formData.append("to", to);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("subject", subject);
    formData.append("content", content);
    formData.append("sendAt", sendAt); // 예약 발송
    attachments.forEach((file) => formData.append("attachment", file));

    sendMailAPI(formData)
      .then(res => console.log("메일 전송 완료", res.data))
      .catch(err => console.error(err));
  };

  const handleSelectMembers = (selected) => {
    const emails = selected.map(m => m.email).join("; ");
    if (activeField === "to") setTo(emails);
    if (activeField === "cc") setCc(emails);
    if (activeField === "bcc") setBcc(emails);
    setModalOpen(false);
  };

  const addressFields = [
    { label: "받는 사람", value: to, setter: setTo, key: "to" },
    { label: "참조", value: cc, setter: setCc, key: "cc" },
    { label: "숨은 참조", value: bcc, setter: setBcc, key: "bcc" },
    { label: "제목", value: subject, setter: setSubject, key: "subject" },
  ];

  return (
    <div className="p-6 w-full h-full flex flex-col gap-4 bg-white rounded-lg shadow-sm">
      {/* 주소/제목 입력 */}
      <div className="flex flex-col gap-3">
        {addressFields.map(field => (
          <div key={field.label} className="flex items-center gap-2">
            <span className="w-28 text-gray-700 font-medium text-right">{field.label}:</span>
            <div className="flex flex-1 gap-2">
              <TextInput
                className="flex-1 text-sm"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.key === "subject" ? "제목을 입력하세요" : "example@domain.com"}
              />
              {field.key !== "subject" && (
                <Button
                  size="sm"
                  className="bg-primary"
                  onClick={() => {
                    setActiveField(field.key);
                    setModalOpen(true);
                  }}
                >
                  주소록
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* 예약발송 */}
        <div className="flex items-center gap-2">
          <span className="w-28 text-gray-700 font-medium text-right">예약 발송:</span>
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={sendAt}
            onChange={(e) => setSendAt(e.target.value)}
          />
        </div>
      </div>

      {/* 첨부파일 */}
      <div className="flex items-center gap-3">
        <span className="w-28 text-gray-700 font-medium text-right">첨부파일:</span>
        <FileInput
          id="attachments"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files))}
        />
      </div>

      {/* 메일 본문 */}
      <div className="flex flex-col gap-2 flex-1">
        <Editor
          apiKey=""
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          value={content}
          init={{
            license_key: "gpl",
            height: 500,
            menubar: false,
            plugins: ["link", "image", "lists", "table", "code", "media", "paste", "wordcount"],
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | link image media | code",
          }}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-white p-3 shadow-inner">
        <Button className="bg-primary" onClick={handleSend}>전송</Button>
        <Button color="gray">임시저장</Button>
        <Button className="bg-primary-content text-primary" color="failure">취소</Button>
      </div>

      {/* 주소록 모달 */}
      <MailAddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSelectMembers}
      />
    </div>
  );
};

export default MailWrite;