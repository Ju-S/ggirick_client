import {useNavigate} from "react-router";
import {useState} from "react";
import Dropdown from "@/components/board/Dropdown.jsx";
import {insertAPI} from "@/api/board/boardAPI.js";
import useBoardGroupStore from "@/store/board/boardGroupStore.js";

export default function BoardPostingPage() {
    const navigate = useNavigate();
    const [boardInfos, setBoardInfos] = useState({
        title: "",
        contents: "",
        boardGroupId: 0,
        isNotification: false,
        files: []
    })
    const groupItems = useBoardGroupStore(state => state.list);

    const postingHandler = () => {

        const form = new FormData();

        // boardInfo를 JSON -> Blob으로 변환
        const boardInfoBlob = new Blob(
            [JSON.stringify({
                title: boardInfos.title,
                contents: boardInfos.contents,
                boardGroupId: boardInfos.boardGroupId,
                isNotification: boardInfos.isNotification
            })],
            {type: "application/json"}
        );


        form.append("boardInfo", boardInfoBlob);

        for (const file of boardInfos.files) {
            form.append("files", file);
        }

        insertAPI(form).then(() => navigate("/board"));
    };

    const onChangeBoardInfoHandler = (e) => {
        const {name, value} = e.target;
        setBoardInfos(prev => ({...prev, [name]: value}));
    }

    const onChangeBoardFileHandler = (e) => {
        setBoardInfos(prev => ({...prev, files: e.target.files}));
    }

    const onChangeBoardNotificationHandler = (e) => {
        setBoardInfos(prev => ({...prev, isNotification: e.target.checked}));
    }

    const onChangeBoardGroupHandler = (e) => {
        setBoardInfos(prev => ({...prev, boardGroupId: e.id}));
    }

    return (
        <div className="space-y-4 p-6 bg-base-100 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>

            {/* 제목 입력 */}
            <div>
                <label className="block mb-2 font-semibold">제목</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="제목을 입력하세요"
                    name="title"
                    value={boardInfos.title}
                    onChange={onChangeBoardInfoHandler}
                    required
                />
            </div>

            {/* 그룹 선택 + 공지 체크박스 */}
            <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                    <label className="block mb-2 font-semibold">그룹 선택</label>
                    <Dropdown
                        onClickHandler={onChangeBoardGroupHandler}
                        name="groupId"
                        selectedItem={boardInfos.boardGroupId}
                        title="그룹 선택"
                        items={groupItems}
                    />
                </div>
                <div className="flex-1 items-center mt-6">
                    <input
                        type="checkbox"
                        id="notice"
                        checked={boardInfos.isNotification}
                        name="isNotification"
                        onChange={onChangeBoardNotificationHandler}
                        className="checkbox checkbox-primary"
                    />
                    <label htmlFor="notice" className="ml-2 font-medium">공지</label>
                </div>
            </div>

            {/* 내용 입력 */}
            <div className="mt-4">
                <label className="block mb-2 font-semibold">내용</label>
                <textarea
                    className="textarea textarea-bordered w-full h-90 resize-none"
                    placeholder="게시글 내용을 입력하세요..."
                    name="contents"
                    value={boardInfos.contents}
                    onChange={onChangeBoardInfoHandler}
                    required
                />
            </div>

            {/* 파일 업로드 */}
            <div className="mt-4">
                <label className="block mb-2 font-semibold">파일 첨부</label>
                <input
                    type="file"
                    multiple
                    name="files"
                    onChange={onChangeBoardFileHandler}
                    className="file-input file-input-bordered w-full"
                />
            </div>

            {/* 버튼 */}
            <div className="mt-6 flex justify-end">
                <button type="submit" className="btn btn-primary" onClick={postingHandler}>
                    등록
                </button>
            </div>
        </div>
    );
}
