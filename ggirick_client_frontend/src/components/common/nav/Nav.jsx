import {useNavigate} from "react-router";
import ThemeDropdown from "../ThemeDropdown.jsx";

export default function Nav() {
    const navigate = useNavigate();

    return (
        <div className="flex gap-2">
            <button className="btn" onClick={() => navigate("/dashboard")}>홈</button>
            <button className="btn" onClick={() => navigate("/board")}>게시판</button>
            <button className="btn" onClick={() => navigate("/task")}>업무관리</button>
            <button className="btn" onClick={() => navigate("/approval")}>전자결재</button>
            <button className="btn" onClick={() => navigate("/calendar")}>일정</button>
            <button className="btn" onClick={() => navigate("/workmanagement")}>근무처리</button>
            <button className="btn" onClick={() => navigate("/reservation")}>예약</button>
            <button className="btn" onClick={() => navigate("/mail")}>메일</button>
            <button className="btn" onClick={() => navigate("/address")}>주소록</button>
            <button className="btn" onClick={() => navigate("/chat")}>메신저</button>
            <button className="btn" onClick={() => navigate("/drive")}>드라이브</button>
            <button className="btn" onClick={() => navigate("/organization")}>조직도</button>
            <ThemeDropdown/>
        </div>
    );
}