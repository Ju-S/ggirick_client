// ApprovalPostingPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Dropdown from "@/components/board/Dropdown.jsx";
import { insertAPI, putAPI } from "@/api/approval/approvalAPI.js";
import { deleteBoardFileAPI } from "@/api/board/boardFileAPI.js";
import ApprovalLineSelector from "@/components/approval/ApprovalLineSelector.jsx";
import useApprovalDocType from "@/hooks/approval/useApprovalDocType.js";
import useApprovalStore from "@/store/approval/approvalStore.js";
import ApprovalAdditionalForm from "@/components/approval/ApprovalAdditionalForm.jsx";

export default function ApprovalPostingPage({ editMode }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const fetchApproval = useApprovalStore(state => state.fetchApprovalInfo);

    const [approvalInfos, setApprovalInfos] = useState({
        title: "",
        content: "",
        docTypeCode: "",
        docData: {},
        files: []
    });

    const [fileList, setFileList] = useState([]);
    const [approvalLine, setApprovalLine] = useState([]); // 선택된 결재자 목록
    const groupItems = useApprovalDocType();

    useEffect(() => {
        if (editMode && id) {
            const { approvalDetail, fileList, approvalLineList } = useApprovalStore.getState().approvalInfo;
            setApprovalLine(approvalLineList.map(({ assigner, ...rest }) => ({
                ...rest,
                id: assigner
            })));
            setApprovalInfos({ ...approvalDetail, files: [] });
            setFileList(fileList || []);
        } else {
            setApprovalInfos({
                title: "",
                content: "",
                docTypeCode: "",
                docData: {},
                files: []
            });
            setApprovalLine([]);
            setFileList([]);
        }
    }, [editMode, id, fetchApproval]);

    const onChangeBoardInfoHandler = (e) => {
        const { name, value } = e.target;
        setApprovalInfos(prev => ({ ...prev, [name]: value }));
    };

    const onChangeBoardFileHandler = (e) => {
        setApprovalInfos(prev => ({
            ...prev,
            files: [...prev.files, ...Array.from(e.target.files)]
        }));
    };

    const onChangeBoardGroupHandler = (e) => {
        setApprovalInfos(prev => ({ ...prev, docTypeCode: e.code }));
    };

    const removeFile = (idx) => {
        setApprovalInfos(prev => {
            const newFiles = [...prev.files];
            newFiles.splice(idx, 1);
            return { ...prev, files: newFiles };
        });
    };

    const removeExistingFile = (id) => {
        setFileList(prev =>
            prev.map(file => file.id === id ? { ...file, toDelete: true } : file)
        );
    };

    const postingHandler = () => {
        if (approvalLine.length === 0) {
            alert("결재자를 최소 1명 이상 선택해주세요.");
            return;
        }

        // 휴가 관련 문서일 경우 docData 검사
        if (["VAC"].includes(approvalInfos.docTypeCode)) {
            const { startDate, startTime, endDate, endTime } = approvalInfos.docData;

            if (!startDate || !startTime || !endDate || !endTime) {
                alert("시작일시와 종료일시는 반드시 입력해야 합니다.");
                return;
            }

            if (new Date(startDate) > new Date(endDate)) {
                alert("종료일시는 시작일시 이후여야 합니다.");
                return;
            }
        }

        // 근무 관련 문서일 경우 docData 검사
        if (["HWR", "OWR"].includes(approvalInfos.docTypeCode)) {
            const { startDateTime, endDateTime } = approvalInfos.docData;

            if (!startDateTime || !endDateTime) {
                alert("시작일시와 종료일시는 반드시 입력해야 합니다.");
                return;
            }

            if (new Date(startDateTime) > new Date(endDateTime)) {
                alert("종료일시는 시작일시 이후여야 합니다.");
                return;
            }
        }

        const form = new FormData();

        const approvalLineData = new Blob(
            [JSON.stringify(
                approvalLine.map((a, idx) => ({
                    assigner: a.id,
                    orderLine: idx
                }))
            )],
            { type: "application/json" }
        );

        const approvalInfoBlob = new Blob(
            [JSON.stringify({
                title: approvalInfos.title,
                content: approvalInfos.content,
                docTypeCode: approvalInfos.docTypeCode,
                docData: approvalInfos.docData
            })],
            { type: "application/json" }
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

    return (
        <div className="space-y-4 p-6 bg-base-100 shadow-md rounded-lg h-[calc(100vh-120px)] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">기안서 {editMode ? "수정" : "작성"}</h1>

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

            {/* 결재선 선택 */}
            <ApprovalLineSelector
                approvalLine={approvalLine}
                setApprovalLine={setApprovalLine}
            />

            {/* 문서 종류 선택 */}
            <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                    <label className="block mb-2 font-semibold">문서 종류</label>
                    <select className="select" required disabled={editMode}>
                        <option disabled selected>문서 종류</option>
                        {groupItems && groupItems.map(e =>
                            <option
                                className={e.code === approvalInfos.docTypeCode ? "active:bg-base-300 active:shadow-none bg-primary text-primary-content" : "active:bg-base-300 active:shadow-none bg-base text-base-content"}
                                onClick={() => onChangeBoardGroupHandler(e)}
                                selected={e.code === approvalInfos.docTypeCode}
                            >
                                {e.name}
                            </option>
                        )}
                    </select>
                </div>
            </div>

            {/* 추가 입력 폼 */}
            <ApprovalAdditionalForm
                docTypeCode={approvalInfos.docTypeCode}
                docData={approvalInfos.docData}
                setDocData={(newData) =>
                    setApprovalInfos(prev => ({ ...prev, docData: newData }))
                }
            />

            {/* 내용 입력 */}
            <div className="mt-4">
                <label className="block mb-2 font-semibold">내용</label>
                <textarea
                    className="textarea textarea-bordered w-full h-90 resize-none"
                    placeholder="문서 내용을 입력하세요..."
                    name="content"
                    value={approvalInfos.content}
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
                    {fileList
                        .filter(file => !file.toDelete)
                        .map(file => (
                            <li key={`exist-${file.id}`}
                                className="flex justify-between items-center bg-base-200 p-2 rounded-md">
                                <span className="truncate">{file.name}</span>
                                <button type="button" className="btn btn-xs btn-error"
                                        onClick={() => removeExistingFile(file.id)}>X</button>
                            </li>
                        ))
                    }

                    {approvalInfos.files.map((file, idx) => (
                        <li key={`new-${idx}`}
                            className="flex justify-between items-center bg-base-200 p-2 rounded-md">
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

            {/* 제출 버튼 */}
            <div className="mt-6 flex justify-end">
                <button type="submit" className="btn btn-primary" onClick={postingHandler}>
                    {editMode ? "수정" : "등록"}
                </button>
            </div>
        </div>
    );
}
