import React, { useState, useEffect } from "react";
import "flowbite";
import { Pagination, TextInput } from "flowbite-react";
import { PenSquare, Plus, Minus } from "lucide-react";
import { useAddressStore } from "../../store/address/modalStore.js";
import AddAddressModal from "./AddAddressModal.jsx";
import {
  getGroupTypeAPI,
  getSubGroupAPI,
  createSubGroupAPI,
  deleteSubGroupAPI,
  getAddressesBySubGroupAPI,
} from "../../api/address/api.jsx";

export default function Address() {
  const [activeTab, setActiveTab] = useState(""); // 대분류 그룹 선택
  const [currentPage, setCurrentPage] = useState(1);
  const [groupTypes, setGroupTypes] = useState([]);
  const [subGroups, setSubGroups] = useState({});
  const [editingSubGroup, setEditingSubGroup] = useState({});
  const [newSubGroupName, setNewSubGroupName] = useState({});
  const [subGroupMessage, setSubGroupMessage] = useState({});

  const contacts = useAddressStore((state) => state.contacts);
  const setContacts = useAddressStore((state) => state.setContacts);
  const setOpenModal = useAddressStore((state) => state.setOpenModal);
  const setSelectedSubGroupId = useAddressStore((state) => state.setSelectedSubGroupId);
  const selectedSubGroupId = useAddressStore((state) => state.selectedSubGroupId);

  // ======================= 대분류 그룹 조회 =======================
  useEffect(() => {
    getGroupTypeAPI()
      .then((res) => setGroupTypes(res.data))
      .catch((err) => console.error("대분류 그룹 조회 실패:", err));
  }, []);

  // ======================= 소분류 그룹 조회 =======================
  const fetchSubGroups = (group) => {
    if (isPublicGroup(group)) return;

    getSubGroupAPI()
      .then((res) => {
        const mapped = res.data.map((sub) => ({
          ...sub,
          groupName: sub.groupName || sub.group_name || "이름없음",
        }));
        setSubGroups((prev) => ({ ...prev, [group.id]: mapped }));
      })
      .catch((err) => console.error("개인주소록 조회 실패:", err));
  };

  // ======================= 소분류 그룹 생성 =======================
  const handleCreateSubGroup = (groupId) => {
    const name = newSubGroupName[groupId];
    if (!name) {
      setSubGroupMessage((prev) => ({
        ...prev,
        [groupId]: { text: "소분류 이름을 입력해주세요.", type: "error" },
      }));
      return;
    }

    createSubGroupAPI(name)
      .then(() => {
        fetchSubGroups({ id: groupId });
        setNewSubGroupName((prev) => ({ ...prev, [groupId]: "" }));
        setEditingSubGroup((prev) => ({ ...prev, [groupId]: false }));
        setSubGroupMessage((prev) => ({
          ...prev,
          [groupId]: { text: "소분류가 생성되었습니다!", type: "success" },
        }));
        setTimeout(() => {
          setSubGroupMessage((prev) => ({ ...prev, [groupId]: null }));
        }, 2000);
      })
      .catch(() => {
        setSubGroupMessage((prev) => ({
          ...prev,
          [groupId]: { text: "생성 실패. 다시 시도해주세요.", type: "error" },
        }));
      });
  };

  // ======================= 소분류 그룹 삭제 =======================
  const handleDeleteSubGroup = (subGroupId, parentId) => {
    deleteSubGroupAPI(subGroupId)
      .then(() => {
        setSubGroups((prev) => ({
          ...prev,
          [parentId]: prev[parentId].filter((sub) => sub.id !== subGroupId),
        }));
        // 삭제 시 선택된 주소록 초기화
        setContacts([]);
      })
      .catch((err) => console.error("소분류 삭제 실패:", err));
  };

  // ======================= 소분류 클릭 시 주소록 조회 =======================
  const handleSubGroupClick = (subGroup) => {
    getAddressesBySubGroupAPI(subGroup.id)
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("주소록 조회 실패:", err));
  };

  // ======================= 그룹 타입 확인 =======================
  const isPublicGroup = (group) => group.name.toLowerCase() === "public";

  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-gray-50 p-4 pt-20 md:ml-64 dark:bg-gray-900">
      {/* 모달 재사용 */}
      <AddAddressModal />

      <div className="grid flex-1 grid-cols-6 gap-4">
        {/* 사이드바 */}
        <aside className="col-span-1 flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <button
            className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={() => setOpenModal(true)}
          >
            <PenSquare className="h-4 w-4" />
            주소록 추가
          </button>

          <div className="flex flex-col gap-2 text-sm">
            {groupTypes.map((group) => {
              const isPublic = isPublicGroup(group);
              return (
                <div key={group.id}>
                  {/* 대분류 그룹 */}
                  <div
                    className={`flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isPublic ? "opacity-50 cursor-default" : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (isPublic) return;
                      const newTab = activeTab === group.id ? "" : group.id;
                      setActiveTab(newTab);
                      if (newTab) fetchSubGroups(group);
                    }}
                  >
                    <span
                      className={`text-left ${
                        activeTab === group.id
                          ? "font-semibold text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {group.description}
                    </span>
                    {!isPublic && (
                      <Plus
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSubGroup((prev) => ({ ...prev, [group.id]: true }));
                          setNewSubGroupName((prev) => ({ ...prev, [group.id]: "" }));
                        }}
                      />
                    )}
                  </div>

                  {/* 소분류 입력창 */}
                  {!isPublic && editingSubGroup[group.id] && (
                    <div className="ml-3 mt-1 flex flex-col gap-1">
                      <div className="flex gap-1">
                        <TextInput
                          type="text"
                          placeholder="소분류 이름 입력"
                          className="w-full text-sm"
                          value={newSubGroupName[group.id] || ""}
                          onChange={(e) =>
                            setNewSubGroupName((prev) => ({ ...prev, [group.id]: e.target.value }))
                          }
                          sizing="sm"
                        />
                        <button
                          className="rounded bg-blue-500 px-2 text-white hover:bg-blue-600"
                          onClick={() => handleCreateSubGroup(group.id)}
                        >
                          +
                        </button>
                      </div>
                      {subGroupMessage[group.id] && (
                        <span
                          className={`text-xs ${
                            subGroupMessage[group.id].type === "error"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {subGroupMessage[group.id].text}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 소분류 리스트 */}
                  {activeTab === group.id &&
                    subGroups[group.id] &&
                    subGroups[group.id].map((sub) => (
                      <div key={sub.id} className="ml-3 mt-1 flex items-center justify-between text-sm">
                        <button
                          className="text-gray-700 dark:text-gray-300 hover:underline text-left flex-1"
                          onClick={() => handleSubGroupClick(sub)}
                        >
                          {sub.groupName}
                        </button>
                        <div className="flex gap-1">
                          {/* 소분류 + 버튼 → 모달 열기 */}
                          <button
                            className="rounded bg-blue-500 px-2 text-white hover:bg-blue-600"
                            onClick={() => {
                              setSelectedSubGroupId(sub.id);
                              setOpenModal(true);
                            }}
                          >
                            +
                          </button>
                          {/* 소분류 - 버튼 → 삭제 */}
                          <button
                            className="rounded bg-red-500 px-2 text-white hover:bg-red-600"
                            onClick={() => handleDeleteSubGroup(sub.id, group.id)}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </aside>

        {/* 주소록 테이블 */}
        <section className="col-span-5 flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <TextInput
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-80 focus:border-gray-300 focus:ring-gray-300 md:w-96 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              sizing="sm"
            />
          </div>

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
              {(Array.isArray(contacts) ? contacts : []).map((contact, i) => (
                <tr key={contact.id ?? i} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td>{contact.name}</td>
                  <td>{contact.companyName}</td>
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