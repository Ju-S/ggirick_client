import React from "react";

export default function MailSidebar() {
    return (
        <aside className="flex w-64 flex-col border-2 border-r m-1 border-gray-200 bg-white">
            <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-gray-700">
                    Mail
                </h2>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2">
                <h3 className="mb-2 text-xs text-gray-500 uppercase">Channels</h3>
                <ul className="space-y-1">
                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 전체메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                300
                            </button>
                        </div>
                    </li>
                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 받은메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                270
                            </button>
                        </div>
                    </li>

                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 중요메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                3
                            </button>
                        </div>
                    </li>

                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 보낸메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                12
                            </button>
                        </div>
                    </li>

                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 임시메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                8
                            </button>
                        </div>
                    </li>

                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 개인메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                6
                            </button>
                        </div>
                    </li>

                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 스팸메일함</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                25
                            </button>
                        </div>
                    </li>

                    <li className=" rounded px-3 py-2 hover:bg-gray-100">
                        <div className="cursor-pointer flex items-center justify-between">
                            <span># 휴지통</span>
                            <button
                                type="button"
                                className=" cursor-pointer rounded-full   bg-gray-500 px-3 py-2 text-center text-xs font-medium text-white focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                78
                            </button>
                        </div>
                    </li>
                </ul>

                <h3 className="mt-4 mb-2 text-xs text-gray-500 uppercase">
                    라벨
                </h3>
                <ul className="space-y-1">
                    <li className="cursor-pointer rounded px-3 py-2 hover:bg-gray-100">
                        개인
                    </li>
                    <li className="cursor-pointer rounded px-3 py-2 hover:bg-gray-100">
                        여행
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
