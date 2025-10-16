import {useNavigate} from "react-router";
import {Button} from "flowbite-react";

export default function Nav() {
    const navigate = useNavigate();

    return (
        <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard")}>홈</Button>
            <Button onClick={() => navigate("/board")}>게시판</Button>
            <Button onClick={() => navigate("/task")}>업무관리</Button>
            <Button onClick={() => navigate("/approval")}>전자결재</Button>
            <Button onClick={() => navigate("/calendar")}>일정</Button>
            <Button onClick={() => navigate("/workmanagement")}>근무처리</Button>
            <Button onClick={() => navigate("/reservation")}>예약</Button>
            <Button onClick={() => navigate("/mail")}>메일</Button>
            <Button onClick={() => navigate("/address")}>주소록</Button>
            <Button onClick={() => navigate("/chat")}>메신저</Button>
            <Button onClick={() => navigate("/drive")}>드라이브</Button>
            <Button onClick={() => navigate("/organization")}>조직도</Button>
        </div>
    );
}