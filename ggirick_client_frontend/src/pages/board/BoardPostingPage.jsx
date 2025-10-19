import {useNavigate} from "react-router";
import {useState} from "react";
import Dropdown from "@/components/board/Dropdown.jsx";
import {useGroupList} from "@/hooks/board/useGroupList.js";
import BoardLayout from "@/pages/board/BoardLayout.jsx";

export default function BoardPostingPage() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [groupId, setGroupId] = useState();
    const [isNotice, setIsNotice] = useState(false);
    const [files, setFiles] = useState([]);
    const groupItems = useGroupList();

    const postingHandler = () => {
        alert(`내용: ${content}\n그룹: ${groupId}\n공지: ${isNotice}\n파일 수: ${files.length}`);
        navigate("/board");
    }

    return (
        <BoardLayout>
            <div className="space-y-4 p-6 bg-base-100 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>

                {/* 그룹 선택 */}
                <div>
                    <label className="block mb-2 font-semibold">그룹 선택</label>
                    <Dropdown
                        onClickHandler={setGroupId}
                        selectedItem={groupId}
                        title="그룹 선택"
                        items={groupItems}
                    />
                </div>

                {/* 공지 여부 */}
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="notice"
                        checked={isNotice}
                        onChange={(e) => setIsNotice(e.target.checked)}
                        className="checkbox checkbox-primary"
                    />
                    <label htmlFor="notice" className="font-medium">공지</label>
                </div>

                {/* 내용 입력 */}
                <div className="mt-4">
                    <label className="block mb-2 font-semibold">내용</label>
                    <textarea
                        className="textarea textarea-bordered w-full h-90 resize-none"
                        placeholder="게시글 내용을 입력하세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* 파일 업로드 */}
                <div className="mt-4">
                    <label className="block mb-2 font-semibold">파일 첨부</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                {/* 버튼 */}
                <div className="mt-6 flex justify-end">
                    <button className="btn btn-primary" onClick={postingHandler}>
                        등록
                    </button>
                </div>
            </div>
        </BoardLayout>
    );
}
