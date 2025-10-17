import React, { useState, useEffect } from "react";
import "flowbite";
import { Pagination, TextInput } from "flowbite-react";
import { PenSquare, Plus } from "lucide-react";
import { useAddressStore } from "../../store/address/modalStore.js";
import AddAddressModal from "./AddAddressModal.jsx";
import { getGroupTypeAPI, getSubGroupAPI } from "../../api/address/api.jsx";

export default function Address() {
  const [activeTab, setActiveTab] = useState(""); // 현재 열려 있는 대분류
  const [currentPage, setCurrentPage] = useState(1);
  const [groupTypes, setGroupTypes] = useState([]);

  const [subGroups, setSubGroups] = useState({}); // -> {[대분류]:[소분류]} 이런느낌

  const contacts = useAddressStore((state) => state.contacts);
  const setOpenModal = useAddressStore((state) => state.setOpenModal);

  // 서버에서 대분류 그룹 가져오기
  useEffect(() => {
    getGroupTypeAPI()
      .then((res) => {
        setGroupTypes(res.data); // [{ name, description }]
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchSubGroups = (groupName) => {
    getSubGroupAPI(groupName)   // axios로 서버 호출
      .then((res) => {
        setSubGroups((prev) => ({
          ...prev,
          [groupName]: res.data, // 서버에서 받은 소분류 배열 저장
        }));
      })
      .catch((err) => console.error(err));
  };

  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-gray-50 p-4 pt-20 md:ml-64 dark:bg-gray-900">
      <AddAddressModal />

      <div className="grid flex-1 grid-cols-6 gap-4">
        {/* ------------------- 사이드 네비게이션 ------------------- */}
        <aside className="col-span-1 flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          {/* 주소록 추가 버튼 */}
          <button
            className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={() => setOpenModal(true)}
          >
            <PenSquare className="h-4 w-4" />
            주소록 추가
          </button>

          {/* 그룹 생성 탭 */}
          <div className="flex flex-col gap-2 text-sm">
            <button className="rounded-md px-3 py-2 text-left transition">
              그룹 생성
            </button>

            {/* ===== 서버에서 받아온 대분류 자동 렌더링 ===== */}
            {groupTypes.map((group) => (
              <div key={group.name}>
                {/* 대분류 버튼 */}
                <div
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    const newTab = activeTab === group.name ? "" : group.name;
                    setActiveTab(newTab);

                    if (newTab && !subGroups[group.name]) {
                      fetchSubGroups(group.name); // 서버에서 소분류 가져오기
                    }
                  }}
                >
                  <button
                    className={`text-left ${
                      activeTab === group.name
                        ? "font-semibold text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {group.description}
                  </button>
                  <Plus className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                </div>

                {/* 소분류 그룹 리스트 (예시 자리) */}
                {activeTab === group.name && subGroups[group.name] && (
                  <div className="ml-3 mt-1 flex flex-col gap-1 text-sm">
                    {subGroups[group.name].map((sub) => (
                      <button
                        key={sub.id}
                        className="text-gray-700 dark:text-gray-300 hover:underline text-left"
                      >
                        {sub.description}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ------------------- 주소록 목록 ------------------- */}
        <section className="col-span-5 flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          {/* 검색창 */}
          <div className="mb-4 flex items-center justify-between">
            <TextInput
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-80 focus:border-gray-300 focus:ring-gray-300 md:w-96 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              sizing="sm"
            />
          </div>

          {/* 주소록 목록 */}
          <div className="flex-1 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <tr className="text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-300">
                  <th className="px-4 py-3">이름</th>
                  <th className="w-32 px-4 py-3 text-center">회사</th>
                  <th className="w-32 px-4 py-3 text-center">직급</th>
                  <th className="w-24 px-4 py-3 text-center">이메일</th>
                  <th className="w-32 px-4 py-3 text-center">전화번호</th>
                  <th className="w-32 px-4 py-3 text-center">주소</th>
                  <th className="w-32 px-4 py-3 text-center">태그</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td>{contact.name}</td>
                    <td>{contact.company}</td>
                    <td>{contact.rank}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.address}</td>
                    <td>{contact.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              totalPages={10}
              showIcons
            />
          </div>
        </section>
      </div>
    </main>
  );
}