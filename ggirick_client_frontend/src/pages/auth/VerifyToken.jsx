import {useLocation} from "react-router";
import {useEffect} from "react";
import {verifyAPI} from "@/api/auth/authAPI.js";
import useAuthStore from "@/store/auth/authStore.js";

export default function VerifyToken({children}) {
    const location = useLocation();
    const {logout} = useAuthStore(state => state);

    // 주소창의 변화, 페이지 리로드 등의 수행 시, auth getmapping 함수 호출.
    // 200이 아니라면 unauthorize오류 즉, jwt가 유효하지 않은 상태.
    // then(resp => if(resp.status !== 200) 세션클리어) 를 해준다.
    useEffect(() => {
        const checkToken = async () => {
            try {
                const resp = await verifyAPI();

                if (resp.status !== 200) {
                    alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                    logout();
                }
            } catch (err) {
                // axios 401 응답 시
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                logout();
            }
        };
        checkToken();
    }, [location.pathname]); // location 전체 대신 pathname만 감지

    return <>{children}</>;
}