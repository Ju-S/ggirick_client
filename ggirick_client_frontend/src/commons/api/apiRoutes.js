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

    address:{

      getGroupType:{
        url:"/address/group-type",
        method:"GET"
      },

      getSubGroup:{
        url:"/address/group",
        method:"GET"
      },

      createSubGroup:(groupName)=>({
        url:"/address/insert-group",
        method:"POST",
        data:{groupName},
      }),

      // 소분류 그룹 삭제
      deleteSubGroup: (subGroupId) => ({
        url: `/address/delete-group/${subGroupId}`,
        method: "DELETE",
      }),

      // 소분류 클릭 시 주소록 조회
      getAddressesBySubGroup: (subGroupId) => ({
        url: `/address/subgroup/${subGroupId}/addresses`,
        method: "GET",
      }),
    }
};

export default apiRoutes;