import {useNavigate} from "react-router-dom";
import {useState} from "react";
import AddGroupModal from "@/components/board/AddGroupModal.jsx";
import useBoardGroupStore from "@/store/board/boardGroupStore.js";
import OrganizationMemberPickerModal from "@/components/common/modals/OrganizationMemberModal.jsx";
import {boardGroupMemberListAPI, putGroupMemberAPI} from "@/api/board/boardAPI.js";

export default function BoardSidebar() {
    const navigate = useNavigate();
    const groupItems = useBoardGroupStore(state => state.list); // 사용자가 속한 그룹
    const [isGroupOpen, setIsGroupOpen] = useState(false); // 그룹 dropdown
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
    const [boardGroupMembers, setBoardGroupMembers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(1);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const addGroupHandler = (groupId) => {
        closeModal();
    };

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
                    className={`btn btn-xs btn-outline btn-primary`}
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal();
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
                                    className="flex justify-between items-center p-2 rounded hover:bg-base-200 cursor-pointer"
                                    onClick={() => navigate(`/board?groupId=${group.id}`)}
                                >
                                    <span className="ml-3">{group.name}</span>
                                    <button
                                        className={`btn btn-xs btn-outline btn-primary`}
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
                onClose={closeModal}
                onSubmit={addGroupHandler}
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
