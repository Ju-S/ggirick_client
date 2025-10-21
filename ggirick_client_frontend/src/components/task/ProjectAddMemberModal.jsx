import { useState } from "react";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import OrganizationMemberPickerModal from "@/components/common/modals/OrganizationMemberModal.jsx";

export default function ProjectAddMemberModal({ open, onClose }) {
    const { selectedProject } = useTaskProjectStore();

    // 기존 멤버 id 배열
    const existingMemberIds = selectedProject?.members?.map((m) => m.employeeId) || [];

    const [selectedMembers, setSelectedMembers] = useState(existingMemberIds);

    const handleSave = (members) => {
        console.log("선택된 멤버:", members);
        setSelectedMembers(members);
        //있다가 프로젝트에 추가하는 로직 넣을것임
        onClose();
    };

    return (
        <OrganizationMemberPickerModal
            open={open}
            onClose={onClose}
            title="프로젝트 멤버 관리"
            selectedMemberIds={existingMemberIds}
            onSave={handleSave}
            showExistingMark={true}
        />
    );
}
