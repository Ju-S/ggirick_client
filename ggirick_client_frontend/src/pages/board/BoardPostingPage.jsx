import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor.js";
import Dropdown from "@/components/board/Dropdown.jsx";
import {useGroupList} from "@/hooks/board/useGroupList.js";

export default function BoardPostingPage() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [groupId, setGroupId] = useState();
    const groupItems = useGroupList();

    const postingHandler = () => {
        alert(content);
        navigate("/board");
    }

    return (
        <div className="p-6 max-h-[500px]">
            <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>
            <Dropdown onClickHandler={setGroupId} selectedItem={groupId} title="그룹선택" items={groupItems}/>
            <SimpleEditor content={content} setContent={setContent}/>
            <div className="mt-4">
                <button className="btn btn-primary" onClick={postingHandler}>
                    등록
                </button>
            </div>
        </div>
    );
}