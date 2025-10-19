import BoardSidebar from "@/components/board/BoardSidebar.jsx";
import Dropdown from "daisyui/components/dropdown/index.js";
import {TextInput} from "flowbite-react";
import Pagination from "@/components/board/Pagination.jsx";
import {useState} from "react";

export default function BoardLayout({children}) {

    return (
        <main className="min-h-screen max-h-screen flex flex-col p-4 pt-20 md:ml-64 bg-base-200">
            <div className="flex-1 grid grid-cols-6 gap-4">
                {/* ------------------- 사이드 네비게이션 ------------------- */}
                <aside
                    className="col-span-1 rounded-lg">
                    <BoardSidebar/>
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
