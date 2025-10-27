import ApprovalSidebar from "@/components/approval/ApprovalSidebar.jsx";
import useEmployeeStore from "@/store/employeeStore.js";
import {useEffect} from "react";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";

export default function ApprovalLayout({children}) {
    const {setEmployee} = useEmployeeStore();

    useEffect(() => {
        getMyInfoAPI().then(resp => {
            setEmployee(resp.data)
        });
    }, []);

    return (
        <main className="min-h-screen max-h-screen flex flex-col p-4 pt-20 md:ml-64 bg-base-200">
            <div className="flex-1 grid grid-cols-6 gap-4">
                {/* ------------------- 사이드 네비게이션 ------------------- */}
                <aside
                    className="col-span-1 rounded-lg">
                    <ApprovalSidebar/>
                </aside>

                {/* ------------------- 게시글 목록 ------------------- */}
                <section
                    className="col-span-5 rounded-lg !bg-base p-5 flex flex-col">
                    {/* 게시글 목록 */}
                    {children}
                </section>
            </div>
        </main>
    );
}
