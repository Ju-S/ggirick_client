import {useSearchParams} from "react-router-dom";
import {useBoardList} from "@/hooks/board/useBoardList.js";
import BoardList from "@/components/board/BoardList.jsx";
import Pagination from "@/components/board/Pagination.jsx";
import React, {useState} from "react";
import Dropdown from "@/components/board/Dropdown.jsx";

export default function BoardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("currentPage")) || 1;
    const groupId = parseInt(searchParams.get("groupId")) || 1;

    const [searchQuery, setSearchQuery] = useState("");
    const [searchFilter, setSearchFilter] = useState(0);

    const boardInfos = useBoardList(currentPage, groupId, searchFilter, searchQuery);

    const searchFilterItems = [
        {name: "제목+내용+작성자", value: 0},
        {name: "제목", value: 1},
        {name: "내용", value: 2},
        {name: "작성자", value: 3},
    ];

    const onSearchQueryChangeHandler = (e) => {
        setSearchQuery(e.target.value);

        // 검색어가 바뀌면 currentPage를 1로 리셋, groupId 유지
        const groupIdParam = searchParams.get("groupId") || 1;
        setSearchParams({
            groupId: groupIdParam,
            currentPage: 1,
            searchQuery: e.target.value
        });
    };

    const onSearchFilterChangeHandler = (e) => {
        const {value} = e.target;
        setSearchFilter(value);
    }

    return (
        <div className="space-y-6">
            {boardInfos && (
                <>
                    <div
                        className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-2 w-full bg-base-200 rounded-lg">
                            <Dropdown
                                onClickHandler={onSearchFilterChangeHandler}
                                selectedItem={searchFilter}
                                title="검색 필터"
                                items={searchFilterItems}
                            />
                        </div>

                        <div className="relative w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-base-content-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-base-300 bg-base-100 p-2.5 pl-10 text-sm text-base-content-900"
                                placeholder="게시글 검색"
                                onChange={onSearchQueryChangeHandler}
                                value={searchQuery}
                            />
                        </div>
                    </div>

                    {/* 게시판 리스트 */}
                    <BoardList boardInfos={boardInfos}/>

                    {/* 페이지네이션 */}
                    <Pagination
                        currentPage={currentPage}
                        groupId={groupId}
                        searchQuery={searchQuery}
                        searchFilter={searchFilter}
                        totalPage={boardInfos.totalPage}
                        pagePerNav={boardInfos.pagePerNav}
                    />
                </>
            )}
        </div>
    );
}
