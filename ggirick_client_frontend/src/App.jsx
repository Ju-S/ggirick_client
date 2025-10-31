// App.js
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useEffect, useState} from "react";

// 테마 + 공통 컴포넌트
import Nav from "./components/common/nav/Nav.jsx";
import {ThemeProvider} from "./context/ThemeContext.jsx";
import SideNav from "@/components/common/sideNav/SideNav.jsx";
import {Navigate} from "react-router";
import {getAllHrMetaAPI} from "@/api/common/employeeMetaAPI.js";

// 스토어
import useCommonStore from "@/store/common/commonStore.js";
import useAuthStore from "@/store/auth/authStore.js";

// 페이지
import EmployeeRoutes from "./routes/EmployeeRoutes.jsx";
import AlertModal from "@/components/common/modals/AlertModal.jsx";
import {LoginPage} from "@/pages/auth/LoginPage.jsx";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";

export default function App() {
    // 전역 상태변수
    const {isLogin, login, logout} = useAuthStore(state => state); // 로그인용
    const setAllCommonData = useCommonStore(state => state.setAllCommonData); //  메타 데이터용
    const {setEmployee} = useEmployeeStore();

    // 오류 모달 상태 설정
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // 로그인 상태 먼저 초기화 (맨 처음 앱 실행 시)
    useEffect(() => {
        const init = async () => {
            const token = sessionStorage.getItem("token");
            const authority = sessionStorage.getItem("authority");

            if (!token || !authority) {
                logout();
                return;
            }

            try {
                const resp = await getMyInfoAPI();
                if (resp.status === 200) {
                    setEmployee(resp.data);
                    login({token, authority}); // 상태 복원
                } else {
                    logout();
                }
            } catch (err) {
                logout();
            }
        };
        init();
    }, []);

    // 로그인 이후 공통 데이터 불러오고 스토어에 저장 (부서 / 직급 / 조직)
    useEffect(() => {
        //  데이터 불러오고 스토어에 저장하는 함수 정의
        const fetchHrMetaData = async () => {
            try {
                // 비동기로 메타데이터 받아오기
                const metaData = await getAllHrMetaAPI();

                // Zustand 스토어에 한꺼번에 저장
                setAllCommonData(metaData);
            } catch (err) {
                console.error("HR 메타데이터 불러오기 실패:", err);
                // 🔹 모달로 에러 안내
                setErrorMessage("서버에서 데이터를 불러오는 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
                setErrorModalOpen(true);
            }
        };

        // 로그인 상태가 true일 때만 실행
        if (isLogin === true) {
            fetchHrMetaData();
        }
    }, [isLogin, setAllCommonData]);

    return (
        <ThemeProvider>

            {/* 전역 에러 안내 모달 — 로그인 여부 상관없이 항상 렌더링 */}
            <AlertModal
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="데이터 로드 실패"
                message={errorMessage}
                type="error"
            />

            <BrowserRouter>
                <div className="flex flex-col h-screen">

                    {isLogin === "none" && (
                        <div className="flex justify-center items-center min-h-screen text-base-content">
                            로그인 상태 확인 중...
                        </div>
                    )}

                    {isLogin === false && (
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="*" element={<Navigate to="/login" replace/>}/>
                        </Routes>
                    )}

                    {isLogin === true && (
                        <>
                            {/* 상단 네비 */}
                            <Nav/>
                            <SideNav/>
                            <Routes>
                                {/* 메인 컨텐츠 */}
                                <Route path="/*" element={
                                    <div className="flex-1 overflow-hidden">
                                        <EmployeeRoutes/>
                                    </div>
                                }/>
                            </Routes>
                        </>
                    )}
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
