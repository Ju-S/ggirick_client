import Logo from '@/assets/logo/ggirick-header.svg?react';
import {useNavigate} from "react-router-dom";

import React, {useEffect, useState} from "react";
import ThemeDropdown from "@/components/common/ThemeDropdown.jsx";
import useAuthStore from "@/store/authStore.js";
import useEmployeeStore from "@/store/employeeStore.js";
import {emailDuplCheck, updateEmployeeAPI} from "@/api/mypage/employeeAPI.js";

export default function Nav() {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const {selectedEmployee, setEmployee} = useEmployeeStore();

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // 수정용 상태
    const [editData, setEditData] = useState({});
    const [profileFile, setProfileFile] = useState(null); // 파일 상태
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        setEditData({
            id: selectedEmployee?.id || "",
            name: selectedEmployee?.name || "",
            phone: selectedEmployee?.phone || "",
            extension: selectedEmployee?.extension || "",
            emailId: selectedEmployee?.email?.split("@")[0] || "",
            email: selectedEmployee?.email || "",
        });
        setPreviewUrl(selectedEmployee?.profileUrl || "");
    }, [isModalOpen, isEditMode]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditData(prev => ({...prev, [name]: value}));
    };

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProfileFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // 미리보기
    };

    const handleSave = async () => {
        try {
            const isDuplicate = await emailDuplCheck(editData.email, editData.phone)
                .then(() => false) // 중복 없음
                .catch((resp) => {
                    alert(resp.response.data);
                    return true; // 중복 있음
                });

            if (isDuplicate) return;

            const formData = new FormData();
            formData.append("profileImg", profileFile || new Blob());
            formData.append("employeeInfo", new Blob([JSON.stringify(editData)], {type: "application/json"}));

            const resp = await updateEmployeeAPI(formData);

            if (resp.status === 200) {
                setEmployee(resp.data);
                setIsEditMode(false);
                setIsModalOpen(false);
            } else {
                alert("수정 실패");
            }
        } catch (err) {
            alert("서버 오류로 수정 실패");
        }
    };

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
        setEditData(prev => ({...prev, phone: value}));
    };

    // 이메일: 앞부분만 입력, 뒤는 고정
    const handleEmailChange = (e) => {
        const filtered = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
        setEditData(prev => ({...prev, email: filtered}));
    };

    return (
        <>
            <nav className="fixed top-0 right-0 left-0 z-50 border-b border-base-200 bg-base-100 px-4 py-2.5">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button onClick={() => navigate("/")} className="mr-4 flex items-center justify-between">
                            <Logo width={120} height={50}/>
                        </button>
                    </div>

                    <div className="flex items-center lg:order-2 gap-4">
                        <ThemeDropdown/>

                        {/* 유저 드롭다운 */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img alt="user avatar" src={previewUrl}/>
                                </div>
                            </label>
                            <ul tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-48">
                                <li className="px-2 py-2 pointer-events-none bg-transparent hover:bg-transparent">
                                    <div>
                                        <span className="font-semibold">{selectedEmployee?.name || "이름 없음"}</span>
                                        <span className="text-xs text-base-content/50 block">
                                            {selectedEmployee?.departmentName} / {selectedEmployee?.jobName}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-base-content/50 block">
                                            {selectedEmployee?.email + "@ggirick.site" || "이메일 없음"}
                                        </span>
                                    </div>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <a onClick={() => setIsModalOpen(true)}>내 정보</a>
                                </li>
                                <li>
                                    <a onClick={logout}>로그아웃</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 내 정보 Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={() => {
                                setIsModalOpen(false);
                                setIsEditMode(false);
                            }}
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4">내 정보</h3>

                        {isEditMode ? (
                            <div className="space-y-2">
                                {/* 프로필 이미지 */}
                                <div className="flex items-center gap-4">
                                    <img src={previewUrl} alt="profile preview" className="w-16 h-16 rounded-full"/>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileChange}
                                        className="file-input file-input-bordered file-input-sm h-10 align-middle"
                                    />
                                </div>

                                <div>
                                    <label className="label"><span className="label-text">이름</span></label>
                                    <input type="text" value={editData.name} className="input input-bordered w-full"
                                           disabled/>
                                </div>
                                <div>
                                    <label className="label"><span className="label-text">전화번호</span></label>
                                    <input type="text" name="phone" value={editData.phone} onChange={handlePhoneChange}
                                           className="input input-bordered w-full"/>
                                </div>
                                <div>
                                    <label className="label"><span className="label-text">내선</span></label>
                                    <input type="text" name="extension" value={editData.extension}
                                           onChange={handleChange} className="input input-bordered w-full"/>
                                </div>
                                <div>
                                    <label className="label"><span className="label-text">이메일</span></label>
                                    <div className="flex">
                                        <input type="text" value={editData.email} onChange={handleEmailChange}
                                               className="input input-bordered w-full rounded-r-none"
                                        />
                                        <span
                                            className="input input-bordered border-l-0 rounded-l-none bg-base-300 flex items-center px-2 select-none">
                                            @ggirick.site
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button className="btn btn-sm btn-primary" onClick={handleSave}>저장</button>
                                    <button className="btn btn-sm" onClick={() => setIsEditMode(false)}>취소</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 mb-2">
                                    <img src={selectedEmployee?.profileUrl} className="w-16 h-16 rounded-full"
                                         alt="profile"/>
                                    <div>
                                        <p><strong>이름:</strong> {selectedEmployee?.name}</p>
                                        <p><strong>전화번호:</strong> {selectedEmployee?.phone}</p>
                                        <p><strong>내선:</strong> {selectedEmployee?.extension}</p>
                                        <p><strong>이메일:</strong> {selectedEmployee?.email + "@ggirick.site"}</p>
                                        <p>
                                            <strong>부서/직급:</strong> {selectedEmployee?.departmentName} / {selectedEmployee?.jobName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button className="btn btn-sm btn-outline" onClick={() => setIsEditMode(true)}>수정
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
