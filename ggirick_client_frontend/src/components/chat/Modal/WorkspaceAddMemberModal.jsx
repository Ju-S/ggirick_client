import OrganizationMemberModal from "@/components/common/modals/OrganizationMemberModal.jsx";
import useChatStore from "@/store/chat/useChatStore.js";
import {useState} from "react";
import chatAPI from "@/api/chat/chatAPI.js";

export default function WorkspaceAddMemberModal({ open, onClose }) {
    const { selectedWorkspace, selectedWorkspaceMember, setSelectedWorkspaceMember } = useChatStore();


    const existingMemberIds = (selectedWorkspaceMember || [])
          // left_at이 없는 멤버만
        .map((m) => m.employeeId);

    const [selectedMembers, setSelectedMembers] = useState(existingMemberIds);


    const handleSave = async (members) => {
        try {
            console.log("선택된 멤버:", members);
            setSelectedMembers(members);

            const response = await  chatAPI.syncWorkspaceMembers(selectedWorkspace.id, members);

            if (response.data.result) {
                await chatAPI.fetchWorkspaceMembers(selectedWorkspace.id);

                alert("멤버 변경에 성공했습니다.");

                // 서버 반영 후 store 업데이트
                const updatedMembers = selectedWorkspaceMember.map((m) => ({
                    ...m,
                    leftAt: members.includes(m.employeeId) ? null : m.leftAt || new Date().toISOString(),
                }));

                setSelectedWorkspaceMember(updatedMembers);

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
            selectedMemberIds={existingMemberIds}
            onSave={handleSave}
            showExistingMark={true}
        />
    );
}
