const apiRoutes = {
    auth: {
        /**
         * 로그인 API<br>
         * POST /api/auth<br>
         * body: { userId, passwd }<br>
         * response: {MemberDTO}
         */
        login: {url: `/auth/login`, method: "POST"},

        /**
         * 로그아웃 API<br>
         * GET /api/auth
         */
        logout: {url: `/auth/logout`, method: "GET"},
    },
    board: {
        /**
         * 게시글 작성 API<br>
         * POST /api/board<br>
         * body: {BoardDTO}
         */
        insert: {url: `/board`, method: "POST"},

        /**
         * 게시글 삭제 API<br>
         * PATCH /api/board<br>
         * body: {BoardDTO}
         */
        delete: (boardId) => ({
            url: `/board/${boardId}`,
            method: "DELETE"
        }),

        /**
         * 게시글 목록 API<br>
         * searchQuery가 있다면 검색의 기능까지 수행<br>
         * GET /api/board<br>
         * response: {BoardDTO}
         */
        list: (currentPage, groupId, searchFilter, searchQuery) => {
            let url = `/board?currentPage=${currentPage}&groupId=${groupId}`;

            if (searchQuery) {
                url += `&searchFilter=${searchFilter}&searchQuery=${searchQuery}`;
            }

            return {
                url: url,
                method: "GET"
            };
        },

        /**
         * 게시글 Item API<br>
         * GET /api/board<br>
         * response: {BoardDTO}
         */
        item: (boardId) => ({
            url: `/board/${boardId}`,
            method: "GET"
        }),

        /**
         * 게시글 수정 API<br>
         * PUT /api/board/{boardId}<br>
         * body: {BoardDTO}
         */
        put: {url: `/board`, method: "PUT"},
    },
    boardGroup: {
        /**
         * 게시판 그룹 목록 API<br>
         * GET /api/board/group<br>
         * response: {List<BoardGroupDTO>}
         */
        list: () => ({
                url: `/board/group`,
                method: "GET"
        }),
    },
};

export default apiRoutes;