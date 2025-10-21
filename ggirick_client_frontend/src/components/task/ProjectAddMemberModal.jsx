import { useEffect, useState } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";
import { getHrMetaStructureAPI } from "@/api/common/employeeMetaAPI.js";

export default function ProjectAddMemberModal({ open, onClose }) {
    const { selectedProject } = useTaskProjectStore();

    const existingMemberIds = selectedProject?.members?.map((m) => m.employeeId) || [];

    const [selectedMembers, setSelectedMembers] = useState(existingMemberIds);
    const [organizationStructure, setOrganizationStructure] = useState([]);

    useEffect(() => {
        if (!open) return;

        setSelectedMembers(existingMemberIds);

        const fetchStructure = async () => {
            try {
                const res = await getHrMetaStructureAPI();
                setOrganizationStructure(res.data || []);
            } catch (err) {
                console.error("조직도 가져오기 실패:", err);
                setOrganizationStructure([]);
            }
        };

        fetchStructure();
    }, [open]);


    const handleCheckboxChange = (employeeId) => {
        setSelectedMembers((prev) =>
            prev.includes(employeeId)
                ? prev.filter((id) => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    return (
        <BaseModal isOpen={open} onClose={onClose} title="프로젝트 멤버 관리">
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {organizationStructure.length === 0 && (
                    <p className="text-sm text-gray-400">조직도를 불러오는 중이거나 존재하지 않습니다.</p>
                )}

                {organizationStructure.map((org) => (
                    <div key={org.code} className="mb-2">
                        <p className="font-semibold">{org.name}</p>
                        <div className="pl-4 flex flex-col gap-1">
                            {org.departments?.map((dept) => (
                                <div key={dept.code} className="mb-1">
                                    <p className="italic text-sm">{dept.name}</p>
                                    <div className="pl-4 flex flex-col gap-1">
                                        {dept.employees?.map((emp) => {
                                            const isExisting = existingMemberIds.includes(emp.id);
                                            const isChecked = selectedMembers.includes(emp.id);
                                            return (
                                                <label
                                                    key={emp.id}
                                                    className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-base-200
                            ${isExisting ? "bg-base-200 font-medium" : ""}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleCheckboxChange(emp.id)}
                                                        className="checkbox"
                                                    />
                                                    {emp.name} {isExisting && "(기존 멤버)"}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-outline" onClick={onClose}>
                    취소
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => {

                        console.log(selectedMembers)
                    }}
                >
                    저장
                </button>
            </div>
        </BaseModal>
    );
}
