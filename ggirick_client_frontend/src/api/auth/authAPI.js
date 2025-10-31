import api from "@/api/common/apiInterceptor.js";
import apiRoutes from "@/api/common/apiRoutes.js";

// 로그인
export function loginAPI(loginInfo) {
    return api({...apiRoutes.auth.login, data: loginInfo});
}

// 초기 비밀번호로 로그인 했는지 체크
export function checkResetRequiredAPI() {
    return api(apiRoutes.auth.checkResetRequired);
}

// 비밀번호 변경 + 이메일 + 폰번호 등록
export function resetPasswordAPI(resetInfo) {
    return api(apiRoutes.auth.resetPassword(resetInfo));
}

// 토큰 유효한지 검사
export function verifyAPI() {return api(apiRoutes.auth.verify);}

