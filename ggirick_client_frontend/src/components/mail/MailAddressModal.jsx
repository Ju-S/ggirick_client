import { useState } from "react";
import OrganizationMembersModal from "@/components/mail/OrganizationMembersModal.jsx";


export default function MailAddressModal({ open, onClose, onSave }) {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSave = (members) => {
    setSelectedMembers(members);
    onSave(members); // MailWrite로 이메일 + name 객체 전달
    onClose();
  };

  return (
    <OrganizationMembersModal
      open={open}
      onClose={onClose}
      title="주소록"
      selectedMemberIds={[]}
      onSave={handleSave}
      showExistingMark={true}
    />
  );
}