import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AddGroupModal from "@/components/board/AddGroupModal.jsx";
import useBoardGroupStore from "@/store/board/boardGroupStore.js";
import {boardGroupMemberListAPI, deleteGroupAPI, putGroupMemberAPI} from "@/api/board/boardGroupAPI.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import ModifyGroupModal from "@/components/board/ModifyGroupModal.jsx";
import FilteredOrganizationMemberModal from "@/components/common/modals/FilteredOrganizationMemberModal.jsx";

export default function BoardSidebar() {
    const navigate = useNavigate();
    const groupItems = useBoardGroupStore(state => state.list); // 사용자가 속한 그룹
    const initGroup = useBoardGroupStore((state => state.init));
    const [isGroupOpen, setIsGroupOpen] = useState(true); // 그룹 dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // 그룹 추가 모달
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false); // 그룹 수정 모달
    const [modifyGroupInfo, setModifyGroupInfo] = useState({id: 0, name: "", description: ""});
    const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
    const [boardGroupMembers, setBoardGroupMembers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(1);

    const {selectedEmployee, setEmployee} = useEmployeeStore();

    useEffect(() => {
        getMyInfoAPI().then(resp => {
            setEmployee(resp.data)
        });
    }, []);

    useEffect(() => {
        if (modifyGroupInfo.id !== 0) {
            setIsModifyModalOpen(true);
        }
    }, [modifyGroupInfo]);

    return (
        <div className="w-full bg-base-100 border-r border-base-300 h-full flex flex-col">
            {/* 글쓰기 버튼 */}
            <div className="p-4 border-b border-base-300">
                <button
                    className="btn btn-primary w-full"
                    onClick={() => navigate("/board/posting")}
                >
                    글쓰기
                </button>
            </div>

            {/* 전사공지 버튼 */}
            <div
                className="flex justify-between items-center p-2 border-b border-base-300 rounded hover:bg-base-200 cursor-pointer"
                onClick={() => navigate("/board?groupId=1")}
            >
                <span>전사공지</span>
            </div>

            {/* 그룹 버튼 */}
            <div
                className="flex justify-between items-center p-2 border-b border-base-300 rounded hover:bg-base-300 cursor-pointer relative"
                onClick={() => setIsGroupOpen(prev => !prev)}
            >
                <span>그룹</span>
                <button
                    className={`btn btn-xs btn-primary`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                    }}
                >
                    +
                </button>
            </div>

            {/* 그룹 dropdown */}
            {isGroupOpen && (
                <div className="flex-1 overflow-y-auto bg-base-100 border-t border-base-300">
                    {groupItems.length > 1 ? (
                        groupItems
                            .filter(group => group.id !== 1)
                            .map(group => (
                                <div
                                    key={group.id}
                                    className="flex justify-between items-center p-2 rounded hover:bg-base-300 cursor-pointer group"
                                    onClick={() => navigate(`/board?groupId=${group.id}`)}
                                >
                                    {/* 그룹명 */}
                                    <span className="ml-3 font-medium">{group.name}</span>

                                    {/* 오른쪽 버튼 영역 */}
                                    <div
                                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        {/* 그룹 소유자일 경우 멤버추가/수정/삭제 버튼 노출 */}
                                        {selectedEmployee?.id === group.ownerId && (
                                            <>
                                                {/* 구성원 추가 버튼 */}
                                                <button
                                                    className="btn btn-xs btn-outline btn-primary p-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        boardGroupMemberListAPI(group.id)
                                                            .then(resp => setBoardGroupMembers(resp.data))
                                                            .then(() => setSelectedGroup(group.id))
                                                            .then(() => setIsOrgModalOpen(true));
                                                    }}
                                                >
                                                    +
                                                </button>

                                                {/* 삭제 버튼 */}
                                                <button
                                                    className="btn btn-xs btn-outline btn-error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm(`"${group.name}" 그룹을 삭제하시겠습니까?`)) {
                                                            console.log("그룹 삭제:", group.id);
                                                            deleteGroupAPI(group.id).then(() => {
                                                                initGroup();
                                                                navigate("/board");
                                                            });
                                                        }
                                                    }}
                                                >
                                                    -
                                                </button>

                                                {/* 수정 버튼 */}
                                                <button
                                                    className="btn btn-xs btn-outline btn-info p-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModifyGroupInfo({
                                                            id: group.id,
                                                            name: group.name,
                                                            description: group.description
                                                        });
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                                         className="lucide lucide-settings-icon lucide-settings">
                                                        <path
                                                            d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                                                        <circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="p-2 text-sm text-base-content/50">가입된 그룹이 없습니다</div>
                    )}
                </div>
            )}

            {/* 그룹 추가 모달 */}
            <AddGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* 그룹 수정 모달 */}
            <ModifyGroupModal
                isOpen={isModifyModalOpen}
                onClose={() => {
                    setIsModifyModalOpen(false);
                    setModifyGroupInfo({id: 0, name: "", description: ""});
                }}
                groupId={modifyGroupInfo.id}
                groupInfo={modifyGroupInfo}
            />

            {/* 조직도 그룹구성원 추가 모달 */}
            {selectedEmployee &&
                <FilteredOrganizationMemberModal
                    onClose={() => setIsOrgModalOpen(false)}
                    selectedMemberIds={boardGroupMembers}
                    selectedOrganizationCodes={selectedEmployee.organizationCode}
                    exclusiveMemberIds={selectedEmployee.id}
                    open={isOrgModalOpen}
                    onSave={(e) => {
                        putGroupMemberAPI(e.map(item => item.id), selectedGroup).then(() => {
                            setIsOrgModalOpen(false);
                        });
                    }}
                />
            }
        </div>
    );
}
