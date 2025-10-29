import {useNavigate} from "react-router-dom";
import {timestampToMonthDay} from "@/utils/common/dateFormat.js";
import useApprovalDocType from "@/hooks/approval/useApprovalDocType.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";

export default function ApprovalList({approvalInfos}) {
    const navigate = useNavigate();
    const {approvalList: approvalList = []} = approvalInfos;
    const docType = useApprovalDocType();
    const {selectedEmployee} = useEmployeeStore();

    const handleRowClick = (id) => navigate(`${id}`);

    const renderRows = (list, isNotice = false) =>
        list.map((e) => (
            <tr
                key={e.id}
                className={`hover:bg-base-200 transition cursor-pointer ${
                    isNotice ? "bg-warning/10" : ""
                }`}
                onClick={() => handleRowClick(e.id)}
            >
                <td className="truncate">
                    <div
                        class="badge badge-sm bg-base-300 mr-2">{docType.filter(type => type.code === e.docTypeCode).map(result => result.name)}
                    </div>
                    {e.title}
                </td>
                <td className="text-center font-medium">{e.name}</td>
                <td className="text-center text-sm text-base-content/50">
                    {timestampToMonthDay(e.createdAt)}
                </td>
                <td className="text-center text-sm">
                    {e.typeId == null ? (e.lastAssigner !== selectedEmployee.id && e.writer != selectedEmployee.id)? "대기" : "진행중" : e.typeId === 1 ? e.writer === selectedEmployee.id ? "기안" : "결재" : "반려"}
                </td>
            </tr>
        ));

    return (
        <div className="overflow-auto h-[calc(100vh-312px)] bg-base-100 shadow-lg rounded-xl border border-base-300">
            <table className="table w-full">
                <thead className="bg-base-200 text-base font-semibold">
                <tr>
                    <th className="w-5/8 text-left pl-6 p-2">제목</th>
                    <th className="w-1/8 text-center p-2">작성자</th>
                    <th className="w-1/8 text-center p-2">작성일</th>
                    <th className="w-1/8 text-center p-2">상태</th>
                </tr>
                </thead>
                <tbody>
                {approvalList.length > 0 ? (
                    renderRows(approvalList)
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center text-base-content-300 py-6">
                            문서가 없습니다
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
