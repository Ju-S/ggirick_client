import {useNavigate} from "react-router";
import {Button} from "flowbite-react";

export default function BoardPostingPage() {
    const navigate = useNavigate();

    return (
        <div>
            boardPosting
            <Button onClick={() => navigate("/board")}>게시판리스트로</Button>
        </div>
    );
}