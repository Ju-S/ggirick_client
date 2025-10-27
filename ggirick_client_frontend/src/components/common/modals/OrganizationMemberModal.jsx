import { useEffect, useState, useMemo } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import { getHrMetaStructureAPI } from "@/api/common/employeeMetaAPI.js";

export default function OrganizationMemberModal({
                                                          open,
                                                          onClose,
                                                          title = "조직도에서 멤버 선택",
                                                          selectedMemberIds = [],
                                                          onSave,
                                                          showExistingMark = true,
                                                    disabledMemberIds = [],
                                                      }) {
    const [organizationStructure, setOrganizationStructure] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState(selectedMemberIds);
    const [searchTerm, setSearchTerm] = useState("");

    // 초기 로드
    useEffect(() => {
        if (!open) return;
        setSelectedMembers(selectedMemberIds);

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

    // 체크박스 토글
    const handleCheckboxChange = (employeeId) => {
        setSelectedMembers((prev) =>
            prev.includes(employeeId)
                ? prev.filter((id) => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    // 모든 직원 데이터 평탄화해서 검색 필터 적용
    const filteredStructure = useMemo(() => {
        if (!searchTerm.trim()) return organizationStructure;

        const lowerSearch = searchTerm.toLowerCase();

        return organizationStructure
            .map((org) => {
                const filteredDepartments = org.departments
                    ?.map((dept) => {
                        const filteredEmployees = dept.employees?.filter(
                            (emp) =>
                                emp.name?.toLowerCase().includes(lowerSearch) ||
                                emp.email?.toLowerCase().includes(lowerSearch)
                        );

                        // 직원이 존재할 때만 반환
                        return filteredEmployees?.length
                            ? { ...dept, employees: filteredEmployees }
                            : null;
                    })
                    ?.filter(Boolean); // department 중 null 제거

                return filteredDepartments?.length
                    ? { ...org, departments: filteredDepartments }
                    : null;
            })
            ?.filter(Boolean); // organization 중 null 제거
    }, [searchTerm, organizationStructure]);


    // 선택된 인원 정보 매핑
    const selectedEmployeeDetails = useMemo(() => {
        const map = [];
        organizationStructure.forEach((org) =>
            org.departments?.forEach((dept) =>
                dept.employees?.forEach((emp) => {
                    if (selectedMembers.includes(emp.id)) map.push(emp);
                })
            )
        );
        return map;
    }, [selectedMembers, organizationStructure]);

    return (
        <BaseModal isOpen={open} onClose={onClose} title={title}>
            {/* 🔍 검색바 */}
            <div className="form-control mb-3">
                <input
                    type="text"
                    placeholder="이름 또는 이메일 검색"
                    className="input input-bordered input-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 선택된 멤버 배지 */}
            {selectedEmployeeDetails.length > 0 && (
                <div className="bg-base-200 rounded-lg p-2 mb-3">
                    <p className="text-sm font-semibold mb-1">
                        선택된 인원 ({selectedEmployeeDetails.length}명)
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {selectedEmployeeDetails.map((emp) => (
                            <div key={emp.id} className="badge badge-outline flex items-center gap-1">
                                {emp.name} {disabledMemberIds.includes(emp.id) && "(OWNER)"}
                                <button
                                    className="ml-1 text-xs text-error"
                                    onClick={() => {
                                        if (!disabledMemberIds.includes(emp.id)) {
                                            handleCheckboxChange(emp.id);
                                        }
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 🏢 조직도 계층 */}
            <div className="max-h-[500px] overflow-y-auto rounded-lg bg-base-100 p-3 space-y-3 border border-base-200">
                {filteredStructure.length === 0 ? (
                    <div className="text-center text-gray-400 py-6">
                        <span className="loading loading-spinner loading-md mr-2"></span>
                        조직도를 불러오는 중이거나 결과가 없습니다.
                    </div>
                ) : (
                    filteredStructure.map((org) => (
                        <details
                            key={org.code}
                            className="collapse collapse-arrow bg-base-200 rounded-lg"
                            open
                        >
                            <summary className="collapse-title font-bold text-base">
                                🏢 {org.name}
                            </summary>

                            <div className="collapse-content space-y-2">
                                {org.departments?.map((dept) => (
                                    <details
                                        key={dept.code}
                                        className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-md"
                                    >
                                        <summary className="collapse-title text-sm font-semibold text-gray-700">
                                            📁 {dept.name}
                                        </summary>

                                        <div className="collapse-content space-y-1 pl-3">
                                            {dept.employees?.map((emp) => {
                                                const isChecked = selectedMembers.includes(emp.id);
                                                const isDisabled = disabledMemberIds?.includes(emp.id); // OWNER 등 제외 멤버
                                                const isExisting = selectedMemberIds.includes(emp.id);

                                                return (
                                                    <label
                                                        key={emp.id}
                                                        className={`flex items-center justify-between px-3 py-1.5 rounded-md transition-colors cursor-pointer
                hover:bg-base-200 ${
                                                            isExisting ? "bg-base-200 font-medium text-primary" : "text-gray-800"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={isDisabled ? true : isChecked} // 비활성 멤버는 항상 체크
                                                                disabled={isDisabled}
                                                                onChange={() => !isDisabled && handleCheckboxChange(emp.id)}
                                                                className="checkbox checkbox-sm"
                                                            />
                                                            <div className="flex flex-col leading-tight">
                    <span>
                        {emp.name} {isDisabled && "(OWNER)"}
                    </span>
                                                                <span className="text-xs text-gray-500">{emp.email}</span>
                                                            </div>
                                                        </div>
                                                        {showExistingMark && isExisting && <span className="badge badge-outline badge-sm">기존</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </details>
                    ))
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end gap-3 mt-4">
                <button className="btn btn-outline btn-sm" onClick={onClose}>
                    취소
                </button>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onSave?.(selectedMembers)}
                >
                    선택 완료
                </button>
            </div>
        </BaseModal>
    );
}
