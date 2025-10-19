import {useNavigate} from "react-router-dom";
import {useGroupList} from "@/hooks/board/useGroupList.js";
import {useState} from "react";

export default function BoardSidebar() {
    const navigate = useNavigate();
    const groupItems = useGroupList(); // [{id, name}]
    const [hoveredGroup, setHoveredGroup] = useState(null);

    const addGroupHandler = (groupId) => {
        alert(`그룹 추가: ${groupId}`);
    };

    return (
        <div className="w-64 bg-base-100 border-r border-base-300 h-full flex flex-col">
            {/* 글쓰기 버튼 */}
            <div className="p-4 border-b border-base-300">
                <button
                    className="btn btn-primary w-full"
                    onClick={() => navigate("/board/posting")}
                >
                    글쓰기
                </button>
            </div>

            {/* 그룹 리스트 */}
            <div className="flex-1 overflow-y-auto p-2">
                {groupItems && groupItems.map(group => (
                    <div
                        key={group.id}
                        className="flex justify-between items-center p-2 rounded hover:bg-base-200 cursor-pointer"
                        onMouseEnter={() => setHoveredGroup(group.id)}
                        onMouseLeave={() => setHoveredGroup(null)}
                        onClick={() => navigate(`/board?groupId=${group.id}`)}
                    >
                        <span>{group.name}</span>
                        <button
                            className={`btn btn-xs btn-outline btn-success ${
                                hoveredGroup === group.id ? "opacity-100" : "opacity-0"
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                addGroupHandler(group.id);
                            }}
                        >
                            +
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
