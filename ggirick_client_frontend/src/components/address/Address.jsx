import React, { useState, useEffect } from "react";
import "flowbite";
import { TextInput } from "flowbite-react";
import { Plus } from "lucide-react";
import { useAddressStore } from "../../store/address/modalStore.js";
import AddAddressModal from "./AddAddressModal.jsx";
import {
  getGroupTypeAPI,
  getSubGroupAPI,
  createSubGroupAPI,
  deleteSubGroupAPI,
  getAddressesBySubGroupAPI,
  deleteAddressAPI,
  getDepartmentsAPI,
  getSharedAddressesAPI,
} from "../../api/address/api.jsx";

/**
 * Address 컴포넌트
 * - 개인/공유 주소록 관리
 * - 소분류 그룹 생성/삭제
 * - 주소록 CRUD
 * - 검색/필터 기능
 */
export function Address() {
  // ------------------- 로컬 상태 -------------------
  const [activeCategory, setActiveCategory] = useState("personal"); // personal / shared 선택
  const [activeTab, setActiveTab] = useState("personal"); // 현재 활성화된 탭 (personal / 공유주소록)
  const [activeDept, setActiveDept] = useState(null); // 공유 주소록 선택한 부서 코드

  const [subGroups, setSubGroups] = useState({}); // 개인 주소록 소분류 그룹 데이터
  const [editingSubGroup, setEditingSubGroup] = useState({}); // 소분류 입력 폼 활성화 여부
  const [newSubGroupName, setNewSubGroupName] = useState({}); // 새 소분류 이름 입력값
  const [subGroupMessage, setSubGroupMessage] = useState({}); // 소분류 관련 성공/실패 메시지
  const [departments, setDepartments] = useState([]); // 공유 주소록 부서 목록
  const [groupTypes, setGroupTypes] = useState([]); // 그룹 타입 정보

  const [searchText, setSearchText] = useState(""); // 검색어
  const [filterKey, setFilterKey] = useState("all"); // 검색 필터: 전체, 이름, 회사 등

  // ------------------- Zustand 전역 상태 -------------------
  const contacts = useAddressStore((state) => state.contacts); // 현재 주소록 목록
  const setContacts = useAddressStore((state) => state.setContacts); // 주소록 목록 업데이트
  const setOpenModal = useAddressStore((state) => state.setOpenModal); // 모달 열기
  const selectedSubGroupId = useAddressStore((state) => state.selectedSubGroupId); // 선택된 소분류 id
  const setSelectedSubGroupId = useAddressStore((state) => state.setSelectedSubGroupId);
  const setEditingContact = useAddressStore((state) => state.setEditingContact); // 수정할 주소록 선택
  const setEditMode = useAddressStore((state) => state.setEditMode); // 수정 모드 설정
  const addContact = useAddressStore((state) => state.addContact); // 새 주소록 추가
  const updateContact = useAddressStore((state) => state.updateContact); // 주소록 업데이트

  // ------------------- 초기 데이터 로딩 -------------------
  useEffect(() => {
    // 그룹 타입 데이터 가져오기
    getGroupTypeAPI()
      .then((res) => setGroupTypes(res.data))
      .catch(console.error);

    // 공유 주소록 부서 데이터 가져오기
    getDepartmentsAPI()
      .then((res) => setDepartments(res.data))
      .catch(console.error);

    // 개인 주소록 소분류 그룹 데이터 가져오기
    fetchSubGroups();
  }, []);

  /**
   * 상태 초기화
   * - 주소록, 탭, 소분류, 선택 그룹 등 모두 초기화
   */
  const resetAllState = () => {
    setContacts([]);
    setActiveTab("");
    setActiveDept(null);
    setEditingSubGroup({});
    setNewSubGroupName({});
    setSubGroupMessage({});
    setSelectedSubGroupId(null);
  };

  /**
   * 개인 주소록 소분류 그룹 조회
   */
  const fetchSubGroups = () => {
    getSubGroupAPI()
      .then((res) => {
        const mapped = res.data.map((sub) => ({
          ...sub,
          groupName: sub.groupName || sub.group_name || "이름없음",
        }));
        setSubGroups({ personal: mapped });
      })
      .catch(console.error);
  };

  /**
   * 소분류 클릭 시 해당 그룹의 주소록 조회
   */
  const handleSubGroupClick = (subGroup) => {
    setSelectedSubGroupId(subGroup.id); // 전역 상태 업데이트
    getAddressesBySubGroupAPI(subGroup.id)
      .then((res) => setContacts(res.data)) // 조회된 주소록 세팅
      .catch(console.error);
  };

  /**
   * 새로운 소분류 생성
   */
  const handleCreateSubGroup = () => {
    const name = newSubGroupName["personal"];
    if (!name) {
      setSubGroupMessage({ personal: { text: "소분류 이름을 입력해주세요.", type: "error" } });
      return;
    }
    createSubGroupAPI(name)
      .then(() => {
        fetchSubGroups(); // 새로 생성 후 목록 갱신
        setNewSubGroupName({ personal: "" }); // 입력값 초기화
        setEditingSubGroup({ personal: false }); // 입력 폼 닫기
        setSubGroupMessage({ personal: { text: "소분류가 생성되었습니다!", type: "success" } });
        setTimeout(() => setSubGroupMessage({}), 2000);
      })
      .catch(() =>
        setSubGroupMessage({ personal: { text: "생성 실패. 다시 시도해주세요.", type: "error" } })
      );
  };

  /**
   * 소분류 삭제
   * - 외래키 CASCADE 있으면 주소록도 자동 삭제 가능
   */
  const handleDeleteSubGroup = (subGroupId) => {
    if (!window.confirm("정말 소분류를 삭제하시겠습니까?")) return;

    deleteSubGroupAPI(subGroupId)
      .then(() => {
        // UI에서 소분류 목록, 선택 그룹, 주소록 초기화
        setSubGroups((prev) => ({ personal: prev.personal.filter((sub) => sub.id !== subGroupId) }));
        setContacts([]);
        setActiveTab("");
        setSelectedSubGroupId(null);
        setSubGroupMessage({ personal: { text: "소분류가 삭제되었습니다.", type: "success" } });
        setTimeout(() => setSubGroupMessage({}), 2000);
      })
      .catch(() => {
        setSubGroupMessage({ personal: { text: "삭제 실패. 다시 시도해주세요.", type: "error" } });
        setTimeout(() => setSubGroupMessage({}), 2000);
      });
  };

  /**
   * 공유 주소록 클릭
   * - 선택한 부서의 주소록 불러오기
   */
  const handleDeptClick = (dept) => {
    setActiveDept(dept.code);
    getSharedAddressesAPI(dept.code)
      .then((res) => setContacts(res.data))
      .catch(console.error);
  };

  /**
   * 주소록 삭제
   * - UI에서 바로 제거
   * - 서버 삭제 실패 시 롤백
   */
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    // UI에서 제거
    const updatedContacts = contacts.filter((c) => c.id !== id);
    setContacts(updatedContacts);

    try {
      // 서버 삭제 요청
      await deleteAddressAPI(id);
    } catch (err) {
      console.error(err);
      alert("삭제 실패: 서버와 동기화 실패");

      // 실패 시 이전 상태로 롤백
      setContacts(contacts);
    }
  };

  /**
   * 주소록 검색 필터링
   */
  const filteredContacts = Array.isArray(contacts)
    ? contacts.filter((contact) => {
      if (!searchText) return true; // 검색어 없으면 전체
      const lower = searchText.toLowerCase();
      if (filterKey === "all") {
        // 전체 필드 검색
        return ["name", "email", "phone", "companyName", "department", "rank"].some(
          (key) => contact[key]?.toLowerCase().includes(lower)
        );
      }
      return contact[filterKey]?.toLowerCase().includes(lower);
    })
    : [];

  // ------------------- 렌더 -------------------
  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-base-300 border-r border-base-300 p-4 pt-20 md:ml-64">
      {/* 주소록 모달 */}
      <AddAddressModal />

      <div className="grid flex-1 grid-cols-6 gap-4 min-h-0">
        {/* 좌측 사이드바: 개인/공유 주소록 + 소분류 */}
        <aside className="col-span-1 flex flex-col gap-2 p-4 rounded-lg border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col gap-2">
            {/* 개인 주소록 버튼 + 소분류 추가 */}
            <div className="flex items-center gap-2">
              <button
                className={`btn w-full flex-1 ${activeCategory === "personal" ? "btn-primary" : "btn-outline"}`}
                onClick={() => {
                  setActiveCategory("personal");
                  const newTab = activeTab === "personal" ? "" : "personal";
                  setActiveTab(newTab);
                  if (newTab) fetchSubGroups();
                }}
              >
                개인 주소록
              </button>
              {activeCategory === "personal" && (
                <Plus
                  className="h-6 w-6 cursor-pointer text-white bg-primary rounded-full p-1"
                  onClick={() => setEditingSubGroup({ personal: true })}
                />
              )}
            </div>

            {/* 공유 주소록 버튼 */}
            <button
              className={`btn w-full ${activeCategory === "shared" ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                resetAllState();
                setActiveCategory("shared");
              }}
            >
              공유 주소록
            </button>

          </div>

          {/* 소분류 입력 폼 */}
          {editingSubGroup["personal"] && (
            <div className="ml-0 mt-2 flex flex-col gap-1">
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="소분류 이름 입력"
                  className="w-full text-sm input"
                  value={newSubGroupName["personal"] || ""}
                  onChange={(e) => setNewSubGroupName({ personal: e.target.value })}
                />
                <button className="bg-primary px-2 text-white" onClick={handleCreateSubGroup}>
                  +
                </button>
              </div>
              {subGroupMessage["personal"] && (
                <span
                  className={`text-xs ${subGroupMessage["personal"].type === "error" ? "text-red-500" : "text-green-500"}`}
                >
                  {subGroupMessage["personal"].text}
                </span>
              )}
            </div>
          )}

          {/* 소분류 리스트 */}
          {activeTab === "personal" &&
            subGroups["personal"]?.map((sub) => (
              <div key={sub.id} className="ml-0 mt-2 flex items-center justify-between text-sm">
                <button className="flex-1 text-left" onClick={() => handleSubGroupClick(sub)}>
                  {sub.groupName}
                </button>
                <div className="flex gap-1">
                  <button
                    className="rounded bg-primary px-2 text-white"
                    onClick={() => {
                      setSelectedSubGroupId(sub.id);
                      setOpenModal(true);
                    }}
                  >
                    +
                  </button>
                  <button
                    className="rounded bg-primary-content/90 px-2 text-white"
                    onClick={() => handleDeleteSubGroup(sub.id)}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}

          {/* 공유 주소록 부서 리스트 */}
          {activeCategory === "shared" &&
            departments.map((dept) => (
              <div
                key={dept.code}
                className={`px-3 py-2 rounded-md hover:bg-base-200 cursor-pointer ${
                  activeDept === dept.code ? "bg-base-300 font-semibold" : ""
                }`}
                onClick={() => handleDeptClick(dept)}
              >
                {dept.name}
              </div>
            ))}
        </aside>

        {/* 주소록 테이블 */}
        <section className="col-span-5 flex flex-col rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm h-full min-h-0">
          {/* 검색/필터 */}
          <div className="flex items-center justify-left gap-3 mb-2">
            <select
              className="select border border-base-300 pr-8 rounded-md text-sm px-2 py-1 focus:outline-none"
              value={filterKey}
              onChange={(e) => setFilterKey(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="name">이름</option>
              <option value="companyName">회사</option>
              <option value="department">부서</option>
              <option value="rank">직급</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-80 md:w-96 text-sm input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* 테이블 */}
          <div className="flex-1 min-h-0 overflow-y-auto border border-base-300 rounded-md">
            <table className="w-full table-fixed border-collapse text-left">
              <thead className="border-b border-base-300 bg-primary sticky top-0 z-10">
              <tr className="text-xs font-semibold tracking-wider text-white uppercase">
                <th className="border px-4 py-3 text-left w-24">이름</th>
                <th className="border px-4 py-3 text-center w-20">회사</th>
                <th className="border px-4 py-3 text-center w-20">부서</th>
                <th className="border px-4 py-3 text-center w-20">직급</th>
                <th className="border px-4 py-3 text-center w-40">이메일</th>
                <th className="border px-4 py-3 text-center w-36">전화번호</th>
                <th className="border px-4 py-3 text-center w-24">주소</th>
                <th className="border px-4 py-3 text-center w-24">편집</th>
              </tr>
              </thead>
              <tbody>
              {filteredContacts.map((contact, i) => (
                <tr key={contact.id ?? i} className="hover:bg-base-100">
                  <td className="px-4 py-3 text-left">{contact.name}</td>
                  <td className="px-4 py-3 text-center">{contact.companyName}</td>
                  <td className="px-4 py-3 text-center">{contact.department}</td>
                  <td className="px-4 py-3 text-center">{contact.rank}</td>
                  <td className="px-4 py-3 text-center">{contact.email}</td>
                  <td className="px-4 py-3 text-center">{contact.phone}</td>
                  <td className="px-4 py-3 text-center">{contact.address}</td>
                  {activeCategory === "personal" && (
                    <td className="px-4 py-3 text-center flex gap-2 pt-5">
                      {/* 수정 버튼 */}
                      <button
                        className="rounded btn btn-primary px-2 text-white"
                        onClick={() => {
                          setEditingContact(contact);
                          setEditMode(true);
                          setOpenModal(true);
                        }}
                      >
                        수정
                      </button>
                      {/* 삭제 버튼 */}
                      <button
                        className="rounded btn-error px-2 btn"
                        onClick={() => handleDeleteAddress(contact.id)}
                      >
                        삭제
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}