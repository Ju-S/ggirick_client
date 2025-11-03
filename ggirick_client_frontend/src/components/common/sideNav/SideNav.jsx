import {useNavigate} from 'react-router-dom';

export default function SideNav({ isOpen, toggleSidebar }) {
    const navigate = useNavigate();

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-base-300 bg-base-100 pt-14 transition-transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
            aria-label="Sidenav"
            id="drawer-navigation"
        >
            <div className="h-full overflow-y-auto border-base-300 bg-base-100 px-3 py-5">
                <div className="md:hidden mb-4">
                    <button className="btn btn-sm" onClick={toggleSidebar}>닫기</button>
                </div>
                <form action="#" method="GET" className="mb-2 md:hidden">
                    <label htmlFor="sidebar-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 "
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="sidebar-search"
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border bg-base-100 p-2 pl-10 text-sm "
                            placeholder="검색어 입력.."
                        />
                    </div>
                </form>
                <ul className="space-y-2">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75 "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="currentColor"
                                className="lucide lucide-house-icon lucide-house h-6 w-6 text-primary transition duration-75 group-hover:text-secondary"
                            >
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                            <span className="ml-3">홈</span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/board")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 0 15 17"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z" />
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                            </svg>
                            <span className="ml-3">게시판</span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/approval")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -1 15 19"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m1.354 4.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                전자결재
              </span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            ></svg>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/calendar")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                일정
              </span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            ></svg>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/workmanagement")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                근무처리
              </span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/reservation")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                예약
              </span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            ></svg>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/task")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="ml-3">업무관리</span>
                        </button>
                    </li>
                </ul>
                <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/mail")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                메일
              </span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            ></svg>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/address")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary "
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                주소록
              </span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            ></svg>
                        </button>
                    </li>
                </ul>
                <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/chat")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                            </svg>
                            <span className="ml-3">메신저</span>
                        </button>
                    </li>
                    {/*<li>*/}
                    {/*    <button*/}
                    {/*        type="button"*/}
                    {/*        onClick={() => navigate("/drive")}*/}
                    {/*        className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"*/}
                    {/*    >*/}
                    {/*        <svg*/}
                    {/*            aria-hidden="true"*/}
                    {/*            className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"*/}
                    {/*            fill="currentColor"*/}
                    {/*            viewBox="0 -2 15 20"*/}
                    {/*            xmlns="http://www.w3.org/2000/svg"*/}
                    {/*        >*/}
                    {/*            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />*/}
                    {/*        </svg>*/}
                    {/*        <span className="ml-3">드라이브</span>*/}
                    {/*    </button>*/}
                    {/*</li>*/}
                </ul>
                <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/organization")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                                <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
                            </svg>
                            <span className="ml-3">조직도</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
