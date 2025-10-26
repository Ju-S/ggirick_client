import React, { useState } from "react";
import { TextInput, Button, FileInput } from "flowbite-react";
import { Editor } from "@tinymce/tinymce-react";

const MailWrite = () => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleSend = () => {
    const formData = new FormData();
    formData.append("to", to);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("subject", subject);
    formData.append("content", content);

    attachments.forEach((file) => {
      formData.append("files", file);
    });

    fetch("http://localhost:8080/mail/send", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log("메일 전송 완료", data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-4">
      {/* 받는 사람 / 참조 / 숨은 참조 / 제목 */}
      <div className="flex flex-col gap-3">
        {[
          { label: "받는 사람", value: to, setter: setTo, placeholder: "example@domain.com" },
          { label: "참조", value: cc, setter: setCc, placeholder: "example@domain.com" },
          { label: "숨은 참조", value: bcc, setter: setBcc, placeholder: "example@domain.com" },
          { label: "제목", value: subject, setter: setSubject, placeholder: "제목을 입력하세요" },
        ].map((field) => (
          <div key={field.label} className="flex items-center gap-3">
            <span className="w-28 text-gray-700 font-medium text-right">{field.label}:</span>
            <TextInput
              className="flex-1"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              sizing="lg"
            />
          </div>
        ))}
      </div>

      {/* 본문 에디터 */}
      <div className="flex flex-col gap-2">
        <Editor
          apiKey="YOUR_TINYMCE_API_KEY"
          value={content}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              "link",
              "image",
              "lists",
              "table",
              "code",
              "media",
              "paste",
              "wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | link image media | code",
          }}
          onEditorChange={(newContent) => setContent(newContent)}
        />
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

      {/* 버튼 */}
      <div className="flex gap-3 justify-end">
        <Button onClick={handleSend}>전송</Button>
        <Button color="gray">임시저장</Button>
        <Button color="failure">취소</Button>
      </div>
    </div>
  );
};

export default MailWrite;