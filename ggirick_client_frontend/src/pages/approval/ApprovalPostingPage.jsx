import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import Dropdown from "@/components/board/Dropdown.jsx";
import {insertAPI, putAPI} from "@/api/approval/approvalAPI.js";
import {useParams} from "react-router-dom";
import {deleteBoardFileAPI} from "@/api/board/boardFileAPI.js";
import ApprovalLineSelector from "@/components/approval/ApprovalLineSelector.jsx";
import useApprovalDocType from "@/hooks/approval/useApprovalDocType.js";
import useApprovalStore from "@/store/approval/approvalStore.js";

export default function ApprovalPostingPage({editMode}) {
    const navigate = useNavigate();
    const [approvalInfos, setApprovalInfos] = useState({});
    const [fileList, setFileList] = useState([]);

    const {id} = useParams();
    const fetchApproval = useApprovalStore(state => state.fetchApprovalInfo);

    const [approvalLine, setApprovalLine] = useState([]); // 선택된 결재자 목록

    useEffect(() => {
        if (editMode && id) {
            const {approvalDetail, fileList} = useApprovalStore.getState().approvalInfo;
            setApprovalInfos({...approvalDetail, files: []});
            console.log(approvalDetail);
            setFileList(fileList || []);
        } else {
            setApprovalInfos({
                title: "",
                contents: "",
                docTypeCode: "",
                docData: {},
                files: []
            });
            setFileList([]);
        }
    }, [editMode, id, fetchApproval]);

    const groupItems = useApprovalDocType();

    // 문서 등록
    const postingHandler = () => {
        if (approvalLine.length === 0) {
            alert("결재자를 최소 1명 이상 선택해주세요.");
            return;
        }

        const form = new FormData();

        const approvalLineData = new Blob(
            [JSON.stringify(
                approvalLine
                    .map((a, idx) => ({
                        assigner: a.id,
                        orderLine: idx
                    }))
            )],
            {type: "application/json"}
        );


        const approvalInfoBlob = new Blob(
            [JSON.stringify({
                title: approvalInfos.title,
                content: approvalInfos.contents,
                docTypeCode: approvalInfos.docTypeCode,
            })],
            {type: "application/json"}
        );

        form.append("approvalInfo", approvalInfoBlob);
        form.append("approvalLine", approvalLineData);

        for (const file of approvalInfos.files) {
            form.append("files", file);
        }

        if (editMode) {
            putAPI(form, id)
                .then(() => navigate(`/approval/${id}`))
                .then(() =>
                    fileList
                        .filter(f => f.toDelete)
                        .forEach(f => deleteBoardFileAPI(f.id))
                );
        } else {
            insertAPI(form).then(() => navigate(`/approval`));
        }
    };

    const onChangeBoardInfoHandler = (e) => {
        const {name, value} = e.target;
        setApprovalInfos(prev => ({...prev, [name]: value}));
    };

    const onChangeBoardFileHandler = (e) => {
        // 기존 선택 파일 + 새로 선택한 파일 합치기
        setApprovalInfos(prev => ({
            ...prev,
            files: [...prev.files, ...Array.from(e.target.files)]
        }));
    };

    const onChangeBoardGroupHandler = (e) => {
        setApprovalInfos(prev => ({...prev, docTypeCode: e.code}));
    };

    // 선택된 파일 제거
    const removeFile = (idx) => {
        setApprovalInfos(prev => {
            const newFiles = [...prev.files];
            newFiles.splice(idx, 1);
            return {...prev, files: newFiles};
        });
    };

    const removeExistingFile = (id) => {
        setFileList(prev =>
            prev.map(file => file.id === id ? {...file, toDelete: true} : file)
        );
    };

    return (
        <div className="space-y-4 p-6 bg-base-100 shadow-md rounded-lg h-[calc(100vh-120px)] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">기안서 작성</h1>

            {/* 제목 입력 */}
            <div>
                <label className="block mb-2 font-semibold">제목</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="제목을 입력하세요"
                    name="title"
                    value={approvalInfos.title}
                    onChange={onChangeBoardInfoHandler}
                    required
                />
            </div>

            {/* 결재선 추가 UI */}
            <ApprovalLineSelector
                approvalLine={approvalLine}
                setApprovalLine={setApprovalLine}
            />

            {/* 문서 종류 선택 */}
            <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                    <label className="block mb-2 font-semibold">문서 종류</label>
                    <Dropdown
                        onClickHandler={onChangeBoardGroupHandler}
                        name="groupId"
                        selectedItem={0}
                        title="문서 종류"
                        items={groupItems}
                        disabled={editMode}
                    />
                </div>
            </div>

            {/* 내용 입력 */}
            <div className="mt-4">
                <label className="block mb-2 font-semibold">내용</label>
                <textarea
                    className="textarea textarea-bordered w-full h-90 resize-none"
                    placeholder="문서 내용을 입력하세요..."
                    name="contents"
                    value={approvalInfos.contents}
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
                    {approvalInfos.files && approvalInfos.files.map((file, idx) => (
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