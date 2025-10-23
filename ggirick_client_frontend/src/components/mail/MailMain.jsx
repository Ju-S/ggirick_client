import React, { useState } from "react";
import { Button, Dropdown, Checkbox } from "flowbite-react";
import { Trash2, AlertTriangle, Reply, Forward, Filter, Layout } from "lucide-react";
import MailList from "./MailList";
import MailDetail from "./MailDetail";
import Pagination from "@/components/board/Pagination.jsx";

export default function MailMain() {
  const [splitMode, setSplitMode] = useState(false); // 좌우분할 여부
  const [selectedMail, setSelectedMail] = useState(null); // 선택된 메일
  const [sortOption, setSortOption] = useState("시간순");
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("선택된 페이지:", page);
    // 나중에 API 호출 시 page 값 전달
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 상단 툴바 */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Checkbox />
          <Button size="sm" color="light" className="flex items-center gap-1"><Trash2 size={16} /> 삭제</Button>
          <Button size="sm" color="light" className="flex items-center gap-1"><AlertTriangle size={16} /> 스팸</Button>
          <Button size="sm" color="light" className="flex items-center gap-1"><Reply size={16} /> 답장</Button>
          <Button size="sm" color="light" className="flex items-center gap-1"><Forward size={16} /> 전달</Button>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            label={<span className="flex items-center gap-1"><Filter size={16} />{sortOption}</span>}
            color="light" size="sm" inline
          >
            <Dropdown.Item onClick={() => setSortOption("시간순")}>시간순</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("보낸사람순")}>보낸사람순</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("제목순")}>제목순</Dropdown.Item>
          </Dropdown>

          <Button size="sm" color="light" onClick={() => setSplitMode(!splitMode)} className="flex items-center gap-1">
            <Layout size={16} /> {splitMode ? "단일 보기" : "좌우분할"}
          </Button>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className={`flex-1 ${splitMode ? "flex" : "flex flex-col"} overflow-hidden`}>
        {/* 메일 리스트 영역 */}
        <div className={`border-r ${splitMode ? "w-1/2 flex flex-col h-full" : selectedMail ? "hidden" : "w-full flex flex-col h-full"}`}>
          {/* 리스트 + 페이지네이션 묶기 */}
          <div className="flex flex-col h-full">
            {/* 스크롤 가능한 리스트 영역 */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <MailList onSelect={setSelectedMail} selectedMail={selectedMail} />
            </div>

            {/* 페이지네이션 항상 고정 */}
            <div className="p-4 border-t flex-shrink-0">
              <Pagination
                // currentPage={currentPage}
                // totalPage={boardInfos.totalPage}
                // pagePerNav={boardInfos.pagePerNav}
              />
            </div>
          </div>
        </div>

        {/* 메일 상세 영역 */}
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