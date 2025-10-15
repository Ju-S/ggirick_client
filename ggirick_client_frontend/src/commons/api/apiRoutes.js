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

        /**
         * 아이디 중복 확인 API<br>
         * GET /api/member<br>
         * param: {memberId}<br>
         * response: true(중복)/false(중복아님)
         */
        checkMemberId: (memberId) => ({
            url: `/member/checkDuplicateId?id=${memberId}`,
            method: "GET"
        }),
    },
};

export default apiRoutes;