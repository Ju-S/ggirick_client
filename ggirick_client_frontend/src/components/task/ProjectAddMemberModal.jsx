import { useState } from "react";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import OrganizationMemberModal from "@/components/common/modals/OrganizationMemberModal.jsx";
import { syncMembersAPI} from "@/api/task/projectAPI.js";

export default function ProjectAddMemberModal({ open, onClose }) {
    const { selectedProjectId,selectedProject,fetchProjects } = useTaskProjectStore();

    // 기존 멤버 id 배열
    const existingMemberIds = selectedProject?.members?.map((m) => m.employeeId) || [];

    const [selectedMembers, setSelectedMembers] = useState(existingMemberIds);

    const handleSave = (members) => {
        console.log("선택된 멤버:", members);
        setSelectedMembers(members);

        syncMembersAPI(selectedProject.id, members)
            .then(response => {
                if (response.data.result) {
                    alert("멤버 변경에 성공했습니다.");
                    fetchProjects();
                } else {
                    alert("멤버 변경에 실패했습니다.");
                }
            })
            .catch(err => {
                console.error("멤버 변경 실패:", err);
                alert("서버 오류가 발생했습니다.");
            });

        onClose();
    };

    return (
        <OrganizationMemberModal
            open={open}
            onClose={onClose}
            title="프로젝트 멤버 관리"
            selectedMemberIds={existingMemberIds}
            onSave={handleSave}
            showExistingMark={true}
        />
    );
}
