import {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import useEmployeeStore from "@/store/employeeStore.js";
import FilteredOrganizationMemberModal from "@/components/common/modals/FilteredOrganizationMemberModal.jsx";

export default function ApprovalLineSelector({
                                                 approvalLine,      // 실제 결재자 배열
                                                 setApprovalLine,   // 상태 setter
                                             }) {
    const {selectedEmployee} = useEmployeeStore();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 결재자 삭제 (기안자는 삭제 불가)
    const removeApprover = (index) => {
        setApprovalLine(approvalLine.filter((_, i) => i !== index));
    };

    // 드래그&드롭 순서 변경 (기안자는 고정)
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(approvalLine);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        setApprovalLine(items);
    };

    // 선택된 결재자로 변경
    const handleSelectApprovalLine = (data) => {
        setApprovalLine(data.map(e => e));
        setIsModalOpen(false);
    }

    if(!selectedEmployee) {
        return (
            <span className="loading loading-spinner loading-md"></span>
        );
    }

    return (
        <div className="mt-4">
            <label className="block font-semibold">
                결재선
            </label>
            <button className="btn btn-sm btn-base mb-2 mt-1" onClick={() => setIsModalOpen(true)}>결재선 설정</button>

            <FilteredOrganizationMemberModal
                selectedOrganizationCodes={selectedEmployee.organizationCode}
                selectedMemberIds={approvalLine.map(e => e.id)}
                exclusiveMemberIds={selectedEmployee.id}
                title="결재선 설정"
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSelectApprovalLine}
            />

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="approvalLine" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex gap-3 overflow-x-auto pb-2"
                        >
                            {/* 기안자 고정 표시 */}
                            <div
                                className="flex flex-col items-center justify-center bg-base-300 border rounded-xl p-3 min-w-[100px] min-h-[110px] shadow-sm"
                            >
                                <span className="text-sm font-semibold">기안자</span>
                                <span className="text-sm mt-1">{selectedEmployee.name}</span>
                                <span className="text-xs text-base-content-500">{selectedEmployee.departmentName}</span>
                            </div>

                            {/* 실제 결재자 */}
                            {approvalLine.map((approver, index) => (
                                <Draggable key={approver.id} draggableId={approver.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex flex-col items-center justify-center bg-base border rounded-xl p-3 min-w-[100px] shadow-sm hover:shadow-md"
                                        >
                                            <span className="text-sm font-semibold">{index + 1}차</span>
                                            <span className="text-sm mt-1">{approver.name}</span>
                                            <span className="text-xs text-base-content-500">{approver.deptName}</span>
                                            <button
                                                onClick={() => removeApprover(index)}
                                                className="mt-2 text-xs text-error hover:text-error cursor-pointer"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
