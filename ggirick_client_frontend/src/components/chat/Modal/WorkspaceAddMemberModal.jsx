import OrganizationMemberModal from "@/components/common/modals/OrganizationMemberModal.jsx";
import useChatStore from "@/store/chat/useChatStore.js";
import { useState, useEffect } from "react";
import chatAPI from "@/api/chat/chatAPI.js";

export default function WorkspaceAddMemberModal({ open, onClose }) {
    const { selectedWorkspace, selectedWorkspaceMember, setSelectedWorkspaceMember } = useChatStore();

    // left_at이 없는 멤버만
    const existingMemberIds = (selectedWorkspaceMember || [])
        .filter((m) => !m.leftAt)
        .map((m) => m.employeeId);

    // 초기 선택 멤버 상태
    const [selectedMembers, setSelectedMembers] = useState(existingMemberIds);

    // 워크스페이스 멤버가 바뀌면 상태 갱신
    useEffect(() => {
        const ids = (selectedWorkspaceMember || [])
            .filter((m) => !m.leftAt)
            .map((m) => m.employeeId);
        setSelectedMembers(ids);

    }, [selectedWorkspaceMember]);

    const handleSave = async (members) => {
        try {
            // OWNER는 항상 포함
            const ownerMembers = (selectedWorkspaceMember || [])
                .filter((m) => m.roleName === "OWNER")
                .map((m) => m.employeeId);

            const finalMembers = Array.from(new Set([...members, ...ownerMembers]));

            setSelectedMembers(finalMembers);

            const response = await chatAPI.syncWorkspaceMembers(selectedWorkspace.id, finalMembers);

            if (response.data.result) {
                // 새로 추가된 멤버 찾아서 merge
                const existingMap = new Map(selectedWorkspaceMember.map(m => [m.employeeId, m]));
                const updatedMembers = finalMembers.map(id => {
                    const existing = existingMap.get(id);
                    if (existing) {
                        return { ...existing, leftAt: null }; // 기존 멤버는 복구
                    } else {
                        // 새 멤버 기본 구조 추가
                        return {
                            employeeId: id,
                            leftAt: null,
                            roleName: "MEMBER",
                            name: "(새 멤버)", // 필요시 OrganizationMemberModal에서 이름도 전달 가능
                        };
                    }
                });

                setSelectedWorkspaceMember(updatedMembers);

                alert("멤버 변경에 성공했습니다.");
            } else {
                alert("멤버 변경에 실패했습니다.");
            }
        } catch (err) {
            console.error("멤버 변경 실패:", err);
            alert("서버 오류가 발생했습니다.");
        }

        onClose();
    };


    return (
        <OrganizationMemberModal
            open={open}
            onClose={onClose}
            title="채팅 워크스페이스 멤버 관리"
            selectedMemberIds={selectedMembers}
            onSave={handleSave}
            showExistingMark={true}
            // OWNER 체크박스 처리 옵션 전달
            disabledMemberIds={selectedWorkspaceMember
                    .filter((m) => m.roleId == 1)
                    .map((m) => m.employeeId)}
        />
    );
}
