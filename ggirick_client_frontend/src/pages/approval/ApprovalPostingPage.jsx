import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import Dropdown from "@/components/board/Dropdown.jsx";
import {insertAPI, putAPI} from "@/api/board/boardAPI.js";
import useBoardGroupStore from "@/store/board/boardGroupStore.js";
import useBoardStore from "@/store/board/boardStore.js";
import {useParams} from "react-router-dom";
import {deleteBoardFileAPI} from "@/api/board/boardFileAPI.js";

export default function ApprovalPostingPage({editMode}) {
    const navigate = useNavigate();
    const [boardInfos, setBoardInfos] = useState({});
    const [fileList, setFileList] = useState([]);

    const {id} = useParams();
    const fetchBoard = useBoardStore(state => state.fetchBoardInfo);

    useEffect(() => {
        if (editMode && id) {
            const {boardDetail, fileList} = useBoardStore.getState().boardInfo;
            setBoardInfos({...boardDetail, files: []});
            console.log(boardDetail);
            setFileList(fileList || []);
        } else {
            setBoardInfos({
                title: "",
                contents: "",
                boardGroupId: 0,
                isNotification: false,
                files: []
            });
            setFileList([]);
        }
    }, [editMode, id, fetchBoard]);

    const groupItems = useBoardGroupStore(state => state.list);

    // 게시글 등록
    const postingHandler = () => {
        const form = new FormData();

        // boardInfo를 JSON -> Blob 변환
        const boardInfoBlob = new Blob(
            [JSON.stringify({
                title: boardInfos.title,
                contents: boardInfos.contents,
                boardGroupId: Number(boardInfos.boardGroupId),
                isNotification: boardInfos.isNotification
            })],
            {type: "application/json"}
        );

        form.append("boardInfo", boardInfoBlob);

        // 파일 첨부
        for (const file of boardInfos.files) {
            form.append("files", file);
        }

        if (editMode) {
            putAPI(form, id)
                .then(() => navigate(`/board/${id}`))
                .then(() =>
                    fileList
                        .filter(f => f.toDelete)
                        .forEach(f => deleteBoardFileAPI(f.id)));
        } else {
            insertAPI(form).then(() => navigate(`/board?groupId=${boardInfos.boardGroupId}`));
        }
    };

    const onChangeBoardInfoHandler = (e) => {
        const {name, value} = e.target;
        setBoardInfos(prev => ({...prev, [name]: value}));
    };

    const onChangeBoardFileHandler = (e) => {
        // 기존 선택 파일 + 새로 선택한 파일 합치기
        setBoardInfos(prev => ({
            ...prev,
            files: [...prev.files, ...Array.from(e.target.files)]
        }));
    };

    const onChangeBoardNotificationHandler = (e) => {
        setBoardInfos(prev => ({...prev, isNotification: e.target.checked}));
    };

    const onChangeBoardGroupHandler = (e) => {
        setBoardInfos(prev => ({...prev, boardGroupId: e.id}));
    };

    // 선택된 파일 제거
    const removeFile = (idx) => {
        setBoardInfos(prev => {
            const newFiles = [...prev.files];
            newFiles.splice(idx, 1);
            return {...prev, files: newFiles};
        });
    };

    const removeExistingFile = (id) => {
        // 서버에 삭제 요청 보내고 성공하면 fileList state 갱신
        setFileList(prev =>
            prev.map(file => file.id === id ? {...file, toDelete: true} : file)
        );
    };

    return (
        <div className="space-y-4 p-6 bg-base-100 shadow-md rounded-lg h-[calc(100vh-120px)] overflow-y-auto">
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
                        disabled={editMode}
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

                <ul className="mt-2 space-y-1">
                    {/* 기존 파일 */}
                    {fileList
                        .filter(file => !file.toDelete)
                        .map(file => (
                            <li key={`exist-${file.id}`}
                                className="flex justify-between items-center bg-base-200 p-2 rounded-md">
                                <span className="truncate">{file.name}</span>
                                <button type="button" className="btn btn-xs btn-error"
                                        onClick={() => removeExistingFile(file.id)}>
                                    X
                                </button>
                            </li>
                        ))
                    }

                    {/* 새 파일 */}
                    {boardInfos.files && boardInfos.files.map((file, idx) => (
                        <li key={`new-${idx}`} className="flex justify-between items-center bg-base-200 p-2 rounded-md">
                            <span className="truncate">{file.name}</span>
                            <button
                                type="button"
                                className="btn btn-xs btn-error"
                                onClick={() => removeFile(idx)}
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 버튼 */}
            <div className="mt-6 flex justify-end">
                <button type="submit" className="btn btn-primary" onClick={postingHandler}>
                    {editMode ? "수정" : "등록"}
                </button>
            </div>
        </div>
    );
}