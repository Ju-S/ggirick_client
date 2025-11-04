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
import {checkResetRequiredAPI, verifyAPI} from "@/api/auth/authAPI.js";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.jsx";
import VerifyToken from "@/pages/auth/VerifyToken.jsx";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";

export default function App() {
    const {isLogin, login, logout} = useAuthStore(state => state);
    const setAllCommonData = useCommonStore(state => state.setAllCommonData);
    const {setEmployee} = useEmployeeStore();
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [mustResetPw, setMustResetPw] = useState(false); // 초기비밀번호 여부 상태

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    
    useEffect(() => {
        // 로그인한 직원 정보 가져오기
        getMyInfoAPI().then(res => {
            if(res.status === 200 && res.data) {
                setEmployee(res.data);
            }else {
                alert("정보를 불러오는데 실패했습니다.");
            }
        });
    }, []);

    // 세션 로그인 복원
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const authority = sessionStorage.getItem("authority");

        if (token && authority) login({token, authority});
        else logout();
    }, []);

    // 로그인 시 HR 메타데이터 + 초기비밀번호 여부 확인
    useEffect(() => {
        const initAfterLogin = async () => {
            try {
                const metaData = await getAllHrMetaAPI();
                setAllCommonData(metaData);

                // 초기비밀번호 상태 확인
                const resp = await checkResetRequiredAPI();
                if (resp.data === true) {
                    setMustResetPw(true);
                } else {
                    setMustResetPw(false);
                }
            } catch (err) {
                console.error("초기 로드 실패:", err);
                setErrorMessage("데이터 로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setErrorModalOpen(true);
            }
        };

        if (isLogin === true) initAfterLogin();
    }, [isLogin, setAllCommonData]);

    return (

        <ThemeProvider>
            <AlertModal
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="데이터 로드 실패"
                message={errorMessage}
                type="error"
            />

            <BrowserRouter>
                <div className="bg-gray-50 antialiased dark:bg-gray-900">
                    {isLogin === "none" && (
                        <div className="flex justify-center items-center min-h-screen text-gray-500">
                            로그인 상태 확인 중...
                        </div>
                    )}

                    {/* 로그인 전 */}
                    {isLogin === false && (
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="*" element={<Navigate to="/login" replace/>}/>
                        </Routes>
                    )}

                    {/* 로그인 후 */}
                    {isLogin === true && (
                        <VerifyToken>
                            {/* 초기 비밀번호면 강제 이동 */}
                            {mustResetPw ? (
                                <Routes>
                                    <Route path="/resetPassword" element={<ResetPasswordPage/>}/>
                                    <Route path="*" element={<Navigate to="/resetPassword" replace/>}/>
                                </Routes>
                            ) : (
                                <>
                                    {/* 상단 네비 */}
                                    <Nav toggleSidebar={toggleSidebar}/>
                                    <SideNav isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
                        </VerifyToken>
                    )}
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
