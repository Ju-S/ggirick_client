import React, {useState} from "react";
import FilteredOrganizationMemberModal from "@/components/common/modals/FilteredOrganizationMemberModal.jsx";
import useEmployeeStore from "@/store/employeeStore.js";

export default function ApprovalAdditionalForm({ docTypeCode, docData, setDocData, viewMode=false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {selectedEmployee} = useEmployeeStore();

    const handleSelectDelegator = (data) => {
        setDocData({...docData, delegatorList: data.map(e => ({id: e.id, name: e.name}))});
        setIsModalOpen(false);
    }

    if (docTypeCode === "CON" || !docTypeCode) return null; // 업무연락

    if (docTypeCode === "VAC") {
        const startTimes = ["09:00", "12:00"];
        const endTimes = ["12:00", "18:00"];

        return (
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block mb-2 font-semibold">대리결재자</label>
                    <button className="btn btn-base btn-xs" onClick={() => setIsModalOpen(true)}>추가</button>
                    {docData?.delegatorList && docData?.delegatorList.map(e => (
                        <div>
                            {e.name}
                            {e.id}
                        </div>
                    ))}
                </div>
                <div>
                    <label className="block mb-2 font-semibold">시작일</label>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        value={docData?.startDate || ""}
                        onChange={(e) => !viewMode && setDocData({...docData, startDate: e.target.value })}
                        disabled={viewMode}
                    />
                    <label className="block mt-2 mb-1 font-semibold">시작 시간</label>
                    <select
                        className="input input-bordered w-full"
                        value={docData?.startTime || ""}
                        onChange={(e) => !viewMode && setDocData({ ...docData, startTime: e.target.value })}
                        disabled={viewMode}
                    >
                        <option value="">선택</option>
                        {startTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-semibold">종료일</label>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        value={docData?.endDate || ""}
                        onChange={(e) => !viewMode && setDocData({ ...docData, endDate: e.target.value })}
                        disabled={viewMode}
                    />
                    <label className="block mt-2 mb-1 font-semibold">종료 시간</label>
                    <select
                        className="input input-bordered w-full"
                        value={docData?.endTime || ""}
                        onChange={(e) => !viewMode && setDocData({...docData, endTime: e.target.value })}
                        disabled={viewMode}
                    >
                        <option value="">선택</option>
                        {endTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                
                <FilteredOrganizationMemberModal
                    selectedOrganizationCodes={selectedEmployee.organizationCode}
                    selectedMemberIds={docData?.delegatorList?.map(e => e.id) || []}
                    exclusiveMemberIds={[
                        selectedEmployee.id,
                        ...(docData?.delegatorList?.map(e => e.id) || [])
                    ]}
                    title="대리결재자 선택"
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSelectDelegator}
                />
            </div>
        );
    }

    if (docTypeCode === "HWR" || docTypeCode === "OWR") {
        // 기존 datetime-local 방식 유지
        return (
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold">시작일시</label>
                    <input
                        type="datetime-local"
                        className="input input-bordered w-full"
                        value={docData?.startDateTime || ""}
                        onChange={(e) => !viewMode && setDocData({ ...docData, startDateTime: e.target.value })}
                        disabled={viewMode}
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">종료일시</label>
                    <input
                        type="datetime-local"
                        className="input input-bordered w-full"
                        value={docData?.endDateTime || ""}
                        onChange={(e) => !viewMode && setDocData({ ...docData, endDateTime: e.target.value })}
                        min={docData?.startDateTime || ""}
                        disabled={viewMode}
                    />
                </div>
            </div>
        );
    }

    if (docTypeCode === "WCE") return null; // 비워두기

    return null;
}
