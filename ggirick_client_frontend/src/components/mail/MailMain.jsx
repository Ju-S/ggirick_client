import React, { useEffect, useState } from "react";
import { Button, Dropdown, Checkbox } from "flowbite-react";
import { Trash2, AlertTriangle, Reply, Forward, Filter, Layout } from "lucide-react";
import MailList from "./MailList";
import MailDetail from "./MailDetail";
import Pagination from "@/components/board/Pagination.jsx";
import { fetchUsersMailsAPI, changeReceiverStatusAPI, deleteReceiverAPI } from "@/api/mail/mailAPI.jsx";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import "flowbite";

// HoverButton 재사용 컴포넌트
const HoverButton = ({ icon: Icon, label, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Button size="sm" color="light" className="flex items-center gap-1" onClick={onClick}>
        <Icon size={16} /> {label}
      </Button>

      {hovered && (
        <span
          className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 cursor-pointer text-red-500 font-bold"
          onClick={(e) => {
            e.stopPropagation(); // 버튼 클릭 방지
            alert(`${label} X 클릭됨!`);
          }}
        >
          ×
        </span>
      )}
    </div>
  );
};

// HoverDropdown 재사용 컴포넌트
const HoverDropdown = ({ label, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Dropdown label={label} color="light" size="sm" inline>
        {children}
      </Dropdown>

      {hovered && (
        <span
          className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 cursor-pointer text-red-500 font-bold"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Dropdown X 클릭됨!`);
          }}
        >
          ×
        </span>
      )}
    </div>
  );
};

export default function MailMain({ currentFolder = "all" }) {
  const [mails, setMails] = useState([]);
  const [splitMode, setSplitMode] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const userEmail = useEmployeeStore(state => state.selectedEmployee?.email +"@ggirick.site");

  const handlePageChange = (page) => setCurrentPage(page);

  const loadMails = async (folder) => {
    if (!userEmail) return;
    try {
      const res = await fetchUsersMailsAPI(folder, userEmail);
      setMails(res.data || []);
      setSelectedMail(null);
    } catch (err) { console.error("메일 가져오기 실패", err); }
  };

  useEffect(() => { loadMails(currentFolder || "all"); }, [userEmail, currentFolder]);

  const handleSelectMail = async (mail) => { setSelectedMail(mail); };

  const handleDelete = async () => {
    if (!selectedMail) return;
    try {
      if (currentFolder === "trash") await deleteReceiverAPI(selectedMail.id, userEmail);
      else await changeReceiverStatusAPI(selectedMail.id, userEmail, 5);
      await loadMails(currentFolder);
      setSelectedMail(null);
    } catch (e) { console.error(e); alert("삭제 실패"); }
  };

  const handleSpam = async () => {
    if (!selectedMail) return;
    try {
      await changeReceiverStatusAPI(selectedMail.id, userEmail, 3);
      await loadMails(currentFolder);
      setSelectedMail(null);
    } catch (e) { console.error(e); alert("스팸 처리 실패"); }
  };

  return (
    <div className="h-full flex flex-col bg-base-100 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-3 border-b bg-base-100">
        <div className="flex items-center gap-2">
          <Checkbox />

          <HoverButton icon={Trash2} label={currentFolder === "trash" ? "영구삭제" : "삭제"} onClick={handleDelete} />
          <HoverButton icon={AlertTriangle} label="스팸" onClick={handleSpam} />
          <HoverButton icon={Reply} label="답장" onClick={() => console.log("답장 클릭")} />
          <HoverButton icon={Forward} label="전달" onClick={() => console.log("전달 클릭")} />
        </div>

        <div className="flex items-center gap-2">
          <HoverDropdown label={<span className="flex items-center gap-1"><Filter size={16} />시간순</span>}>
            <Dropdown.Item>시간순</Dropdown.Item>
            <Dropdown.Item>보낸사람순</Dropdown.Item>
            <Dropdown.Item>제목순</Dropdown.Item>
          </HoverDropdown>

          <Button size="sm" color="light" onClick={() => setSplitMode(!splitMode)} className="flex items-center gap-1">
            <Layout size={16} /> {splitMode ? "단일 보기" : "좌우분할"}
          </Button>
        </div>
      </div>

      <div className={`flex-1 ${splitMode ? "flex" : "flex flex-col"} overflow-hidden`}>
        <div className={`border-r ${splitMode ? "w-1/2 flex flex-col h-full" : selectedMail ? "hidden" : "w-full flex flex-col h-full"}`}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto min-h-0">
              <MailList mails={mails} onSelect={handleSelectMail} selectedMail={selectedMail} />
            </div>
            <div className="p-4 border-t flex-shrink-0">
              <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>

        {(splitMode || selectedMail) && (
          <div className={`overflow-hidden ${splitMode ? "w-1/2 flex flex-col h-full" : "w-full flex flex-col h-full"}`}>
            <div className="overflow-y-auto flex-1 min-h-0">
              <MailDetail mail={selectedMail} onBack={() => setSelectedMail(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}