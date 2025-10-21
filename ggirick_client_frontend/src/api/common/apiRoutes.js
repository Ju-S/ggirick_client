const apiRoutes = {
  auth: {
    /**
     * 로그인 API<br>
     * POST /api/auth<br>
     * body: { userId, passwd }<br>
     * response: {MemberDTO}
     */
    login: { url: `/auth/login`, method: "POST" },

    /**
     * 로그아웃 API<br>
     * GET /api/auth
     */
    logout: { url: `/auth/logout`, method: "GET" },
  },
  board: {
    /**
     * 게시글 작성 API<br>
     * POST /api/board<br>
     * body: {BoardDTO}
     */
    insert: { url: `/board`, method: "POST" },

    /**
     * 게시글 삭제 API<br>
     * PATCH /api/board<br>
     * body: {BoardDTO}
     */
    delete: (boardId) => ({
      url: `/board/${boardId}`,
      method: "DELETE",
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
        method: "GET",
      };
    },

    /**
     * 게시글 Item API<br>
     * GET /api/board<br>
     * response: {BoardDTO}
     */
    item: (boardId) => ({
      url: `/board/${boardId}`,
      method: "GET",
    }),

    /**
     * 게시글 수정 API<br>
     * PUT /api/board/{boardId}<br>
     * body: {BoardDTO}
     */
    put: { url: `/board`, method: "PUT" },
  },
  project: {
    /**
     * 자신이 속한 업무 프로젝트 리스트를 가져오는 API<br>
     * GET /project <br>
     * response: {List<ProjectDto>}
     */
    list: {
      url: "/project",
      method: "GET",
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
  },
  task: {
    insert:{
      url:`/project/task`,
      method:"POST",
    },

    updateStatus: (taskId) => ({
      url: `/project/task/${taskId}/status`,
      method: "PATCH",
    }),
    update: (taskId) => ({
      url: `project/task/${taskId}`,
      method: "PUT",
    }),
    delete: (taskId) => ({
      url: `project/task/${taskId}`,
      method: "DELETE"
    }),
  },
  reservation: {
    /**
     * 예약 추가 API<br>
     * POST /reservations<br>
     * body: {ReservationDTO}
     */
    insert: {
      url: "/reservations",
      method: "POST",
    },
    /**
     * 예약 삭제 API<br>
     * DELETE /reservation/{예약번호(id)}<br>
     */
    delete: (reservationId) => ({
      url: `/reservations/${reservationId}`,
      method: "DELETE",
    }),
    /**
     * 예약 수정 API<br>
     *UPDATE /reservations/{예약번호(id)}<br>
     * body: {ReservationDTO}
     */
    update: (reservationId) => ({
      url: `/reservations/${reservationId}`,
      method: "PUT",
    }),

    /**
     * 캘린더용 한달치 예약 리스트를 가져오는 API<br>
     * GET /reservations/calendar <br>
     * response: {List<ResourceDto>}
     */
    reservationCalendarList: {
      url: "/reservations/calendar",
      method: "GET",
    },
    /**
     * 로그인한 사용자의 예약 리스트를 가져오는 API<br>
     * GET /reservations/my <br>
     * response: {List<ReservationDTO>}
     */
    myReservationList: { url: "/reservations/my", method: "GET" },
  },
  resource: {
    insert: {
      url: "/reservations/resource",
      method: "POST",
    },
    delete: {},
    update: {},

    /**
     * 예약에 사용할 전체 리소스 리스트를 가져오는 API<br>
     * GET /reservations/resource <br>
     * response: {List<ResourceDto>}
     */
    resourceList: { url: "/reservations/resource", method: "GET" },
  },
};

export default apiRoutes;