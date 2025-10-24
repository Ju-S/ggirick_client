import React, { useState, useEffect } from "react";
import {
  useCreateBlockNote,

} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { ko } from "@blocknote/core/locales";
import chatAPI from "@/api/chat/chatAPI.js";
import useChatStore from "@/store/chat/useChatStore.js";

export default function ChatInput({onSend}) {

    const {sendMessage} = useChatStore();

    const [content, setContent] = useState([]);
  const editor = useCreateBlockNote({
    initialContent: [{ type: "paragraph", content: [] }],
    dictionary: {
      ...ko,
      placeholders: { default: "채팅을 작성하세요" },
    },
    uploadFile: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      return data.url;
    },
  });

  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      setContent(editor.document);
    });
    return () => unsubscribe();
  }, [editor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editor.isEmpty) {
      alert("채팅을 입력해주세요");
      return;
    }

      try {

          onSend({
              type: "user",
              content: editor.document
          });
          editor.replaceBlocks(editor.document, [{ type: "paragraph", content: [] }]);


      } catch (err) {
          console.error("메시지 전송 실패:", err);
      }
    };



  return (
    <div className="border-t bg-base-100 p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="flex items-center rounded-lg bg-base-100/50 px-3 py-2">

          {/* 입력창 */}

               <div className="chat-input w-full h-full">
                   <BlockNoteView
                       id="chat"
                       editor={editor}
                       className="w-full h-full p-2.5 text-sm placeholder:text-base-content/50 focus:outline-none"
                   />

               </div>

          {/* 전송 버튼 */}
          <button
            type="submit"
            className="inline-flex cursor-pointer justify-center rounded-full p-2 text-primary hover:bg-primary/20"
          >
            <svg
              className="h-5 w-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}
