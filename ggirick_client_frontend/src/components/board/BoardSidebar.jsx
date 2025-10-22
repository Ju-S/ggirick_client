import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AddGroupModal from "@/components/board/AddGroupModal.jsx";
import useBoardGroupStore from "@/store/board/boardGroupStore.js";
import OrganizationMemberPickerModal from "@/components/common/modals/OrganizationMemberModal.jsx";
import {boardGroupMemberListAPI, deleteGroupAPI, putGroupMemberAPI} from "@/api/board/boardGroupAPI.js";
import useEmployeeStore from "@/store/employeeStore.js";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import ModifyGroupModal from "@/components/board/ModifyGroupModal.jsx";

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
                className="flex justify-between items-center p-2 border-b border-base-300 rounded hover:bg-base-200 cursor-pointer relative"
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
                                    className="flex justify-between items-center p-2 rounded hover:bg-base-200 cursor-pointer group"
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
                                                    className="btn btn-xs btn-outline btn-primary"
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

                                                {/* 수정 버튼 */}
                                                <button
                                                    className="btn btn-xs btn-outline btn-info"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModifyGroupInfo({
                                                            id: group.id,
                                                            name: group.name,
                                                            description: group.description
                                                        });
                                                    }}
                                                >
                                                    ✏️
                                                </button>

                                                {/* 삭제 버튼 */}
                                                <button
                                                    className="btn btn-xs btn-outline btn-error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // TODO: 삭제 확인 및 API 호출
                                                        if (confirm(`"${group.name}" 그룹을 삭제하시겠습니까?`)) {
                                                            console.log("그룹 삭제:", group.id);
                                                            deleteGroupAPI(group.id).then(() => {
                                                                initGroup();
                                                                navigate("/board");
                                                            });
                                                        }
                                                    }}
                                                >
                                                    🗑️
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
            <OrganizationMemberPickerModal
                onClose={() => setIsOrgModalOpen(false)}
                selectedMemberIds={boardGroupMembers}
                open={isOrgModalOpen}
                onSave={(e) => {
                    putGroupMemberAPI(e, selectedGroup).then(() => {
                        setIsOrgModalOpen(false);
                    });
                }}
            />
        </div>
    );
}
