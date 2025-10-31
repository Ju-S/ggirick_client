import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import GgirickLogo from "@/assets/logo/ggirick-header.svg?react";
import {resetPasswordAPI} from "@/api/auth/authAPI.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import {emailDuplCheck} from "@/api/mypage/employeeAPI.js";
import useAuthStore from "@/store/auth/authStore.js";

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const employee = useEmployeeStore(state => state.employee);
    const logout = useAuthStore(state => state.logout);
    const [passwordMatch, setPasswordMatch] = useState(null); // true / false / null
    const [emailCheck, setEmailCheck] = useState(false);

    // ======== 정규식 모음 ========
    // 비밀번호: 영어 + 숫자 + 특수문자 포함 8자 이상
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,}$/;
    // 이메일 앞부분: 영문/숫자 조합으로 3자 이상
    const emailPrefixRegex = /^[A-Za-z0-9._%+-]{3,}$/;
    // 전화번호: 010으로 시작 + 00000000 or 0000-0000 형식
    const phoneRegex = /^010(-?\d{4}-?\d{4})$/;

    const [form, setForm] = useState({
        newPw: "",
        confirmPw: "",
        email: "",
        phone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        // 이메일 또는 전화번호가 변경되면 중복확인 다시 하게끔 초기화
        if (name === "emailPrefix" || name === "phone") {
            setEmailCheck(false);
        }
    };

    useEffect(() => {
        if (form.newPw && form.confirmPw) {
            setPasswordMatch(form.newPw === form.confirmPw);
        } else {
            setPasswordMatch(null);
        }
    }, [form.newPw, form.confirmPw]);

    // 전화번호 숫자만 입력 + 하이픈 자동
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // 숫자만 남기기
        if (value.length > 3 && value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 6 && value.length <= 10) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
        } else if (value.length > 10) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
        setForm(prev => ({...prev, phone: value}));
    };

    // 이메일/폰 중복 확인
    const handleCheckEmail = async () => {
        if (!form.emailPrefix?.trim() || !form.phone?.trim()) {
            alert("이메일과 전화번호를 모두 입력해주세요.");
            return;
        }

        try {
            await emailDuplCheck(form.emailPrefix, form.phone); // 실제 전체 이메일로 중복검사
            alert("사용 가능한 이메일 및 전화번호입니다.");
            setEmailCheck(true);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                alert(err.response.data); // 서버에서 보낸 에러 메시지 출력
            } else {
                alert("중복 확인 중 오류가 발생했습니다.");
            }
            setEmailCheck(false);
        }
    };

    // 비밀번호/이메일/폰 등록
    const handleSubmit = async () => {
        if (!form.newPw || !form.confirmPw) {
            alert("새 비밀번호를 입력해주세요. (영문,숫자,특문 포함 8자 이상)");
            return;
        }

        if (!passwordMatch) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!form.emailPrefix || !form.phone || !emailCheck) {
            alert("이메일/전화번호 중복확인을 완료해주세요.");
            return;
        }

        if (!pwRegex.test(form.newPw)) {
            alert("비밀번호는 영어, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.");
            return;
        }

        if (!emailPrefixRegex.test(form.emailPrefix)) {
            alert("이메일 아이디는 영문 또는 숫자 조합 3자 이상이어야 합니다.");
            return;
        }

        if (!phoneRegex.test(form.phone)) {
            alert("전화번호는 010으로 시작하며 '-' 포함 또는 미포함 8자리 형식이어야 합니다.");
            return;
        }

        try {
            const resp = await resetPasswordAPI({
                empId: employee.id,
                newPw: form.newPw,
                email: form.emailPrefix,
                phone: form.phone,
            });

            if (resp.status === 200) {
                alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");

                // Zustand에서 인증 상태 및 토큰 제거
                logout();

                // 강제 새로고침 + 로그인 페이지 이동
                window.location.href = "/login";
            }
        } catch (err) {
            console.error(err);
            alert("비밀번호 변경에 실패했습니다.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
            <GgirickLogo alt="회사 로고" className="w-40 mb-6"/>

            <h2 className="text-2xl font-bold mb-2 text-center">
                입사를 환영합니다 🎉
            </h2>
            <p className="text-sm opacity-70 mb-6 text-center">
                보안을 위해 초기 비밀번호를 변경하고 정보를 등록해주세요.
            </p>

            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                        비밀번호 변경 및 정보 등록
                    </h3>

                    {/* 새 비밀번호 */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">새 비밀번호</span>
                        </label>
                        <br/>
                        <input
                            type="password"
                            name="newPw"
                            value={form.newPw}
                            onChange={handleChange}
                            className="input input-bordered w-[85%]"
                            placeholder="새 비밀번호를 입력하세요 (영문,숫자,특문 포함 8자 이상)"
                        />
                    </div>

                    {/* 새 비밀번호 확인 */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">새 비밀번호 확인</span>
                        </label>

                        <div className="flex items-center justify-between gap-3">
                            <input
                                type="password"
                                name="confirmPw"
                                value={form.confirmPw}
                                onChange={handleChange}
                                className="input input-bordered w-[85%]"  // 크기 조정
                                placeholder="새 비밀번호를 다시 입력하세요"
                            />
                            {passwordMatch !== null && (
                                <span
                                    className={`text-sm font-semibold ${
                                        passwordMatch ? "text-primary" : "text-error"
                                    }`}
                                >
                                    {passwordMatch ? "일치" : "불일치"}
                                </span>
                            )}
                        </div>
                    </div>


                    {/* 이메일 전체 입력 */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">이메일</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="emailPrefix"
                                value={form.emailPrefix || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, emailPrefix: e.target.value }))
                                }
                                className="input input-bordered flex-1"
                                placeholder="이메일 아이디 (영문, 숫자 3자 이상)"
                            />
                            <span className="text-sm font-medium">@ggirick.site</span>
                        </div>
                    </div>

                    {/* 전화번호 입력 */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">전화번호</span>
                        </label>
                        <br/>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handlePhoneChange}
                            className="input input-bordered"
                            placeholder="전화번호를 입력해주세요"
                        />
                    </div>

                    {/* 중복확인 버튼 */}
                    <div className="form-control mb-5">
                        <button
                            className="btn btn-outline btn-sm w-full"
                            onClick={handleCheckEmail}
                        >
                            이메일/전화번호 중복확인
                        </button>
                    </div>

                    <button className="btn btn-primary w-full" onClick={handleSubmit}>
                        변경 완료
                    </button>
                </div>
            </div>

            <p className="mt-6 text-sm text-gray-500 text-center">
                ⚠️ 비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.
            </p>
        </div>
    );
}

export default ResetPasswordPage;
