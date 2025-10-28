import {useNavigate} from "react-router-dom";
import {useState} from "react";
import useApprovalGroup from "@/hooks/approval/useApprovalGroup.js";

export default function ApprovalSidebar() {
    const navigate = useNavigate();
    const {groupItems, boxItems} = useApprovalGroup();
    const [isProgressOpen, setIsProgressOpen] = useState(true); // 그룹 dropdown
    const [isBoxOpen, setIsBoxOpen] = useState(true); // 그룹 dropdown

    return (
        <div className="w-full bg-base-100 border-r border-base-300 h-full flex flex-col">
            {/* 글쓰기 버튼 */}
            <div className="p-4 border-b border-base-300">
                <button
                    className="btn btn-primary w-full"
                    onClick={() => navigate("/approval/posting")}
                >
                    기안작성
                </button>
            </div>

            {/* 그룹 버튼 */}
            <div
                className="flex justify-between items-center p-2 rounded hover:bg-base-300 cursor-pointer relative bg-base-200"
                onClick={() => setIsProgressOpen(prev => !prev)}
            >
                <span>진행 중인 문서</span>
            </div>

            {/* 그룹 dropdown */}
            {isProgressOpen && (
                <div className="bg-base-100">
                    {groupItems.length > 1 ? (
                        groupItems
                            .map(group => (
                                <div
                                    key={group.id}
                                    className="flex justify-between items-center p-2 rounded hover:bg-base-200 cursor-pointer group"
                                    onClick={() => navigate(`/approval?box=${group.id}`)}
                                >
                                    {/* 그룹명 */}
                                    <span className="ml-3 font-medium">{group.name}</span>
                                </div>
                            ))
                    ) : (
                        <div className="p-2 text-sm text-base-content/50">가입된 그룹이 없습니다</div>
                    )}
                </div>
            )}

            <div
                className="flex justify-between items-center p-2 rounded hover:bg-base-300 cursor-pointer relative bg-base-200"
                onClick={() => setIsBoxOpen(prev => !prev)}
            >
                <span>보관함</span>
            </div>

            {/* 그룹 dropdown */}
            {isBoxOpen && (
                <div className="bg-base-100">
                    {boxItems
                        .map(group => (
                                <div
                                    key={group.id}
                                    className="flex justify-between items-center p-2 rounded hover:bg-base-200 cursor-pointer group"
                                    onClick={() => navigate(`/approval?box=${group.id}`)}
                                >
                                    {/* 그룹명 */}
                                    <span className="ml-3 font-medium">{group.name}</span>
                                </div>
                            )
                        )}
                </div>
            )}
        </div>
    );
}
