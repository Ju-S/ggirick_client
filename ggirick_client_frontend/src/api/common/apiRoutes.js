import {checkResetRequiredAPI} from "@/api/auth/authAPI.js";

const apiRoutes = {
    auth: {
        /**
         * 로그인 API<br>
         * POST /auth/login<br>
         * body: { userId, passwd }<br>
         * response: {MemberDTO}
         */
        login: {url: `/auth/login`, method: "POST"},

        /**
         * 로그아웃 API<br>
         * GET /auth/logout
         */
        logout: {url: `/auth/logout`, method: "GET"},

        /**
         * 초기 비밀번호로 로그인 했는지 확인 API<br>
         * GET /auth/checkResetRequired<br>
         * response: {boolean}
         */
        checkResetRequired: {url: `/auth/checkResetRequired`, method: "GET"},

        /**
         * 아이디 중복 확인 API<br>
         * GET /employee<br>
         * param: {empId}<br>
         * response: true(중복)/false(중복아님)
         */
        checkEmployeeId: (empId) => ({
            url: `/employee/checkDuplicateId?id=${empId}`,
            method: "GET",
        }),

        /**
         * 이메일 중복 확인 API
         * GET /auth/check-email?email={email}
         * response: true(중복)/false(중복아님)
         */
        checkEmailDuplicate: (email) => ({
            url: `/auth/checkEmail?email=${email}`,
            method: "GET",
        }),

        /**
         * 초기 비밀번호 변경 + 이메일 등록
         * POST /auth/reset-password
         * body: { empId, currentPw, newPw, email }
         */
        resetPassword: (resetInfo) => ({
            url: `/auth/resetPassword`,
            method: "POST",
            data: resetInfo
        }),

        /**
         * JWT 인증 토큰 유효한지 검사
         * GET /auth/verify
         * response: 200(정상), SC_UNAUTHORIZED(비정상)
         */
        verify: {url:`/auth/verify`, method:"GET"},

    },
    board: {
        /**
         * 게시글 작성 API<br>
         * POST /board<br>
         * body: {BoardDTO}
         */
        insert: {url: `/board`, method: "POST"},

        /**
         * 게시글 삭제 API<br>
         * PATCH /board<br>
         * body: {BoardDTO}
         */
        delete: (boardId) => ({
            url: `/board/${boardId}`,
            method: "DELETE",
        }),

        /**
         * 게시글 목록 API<br>
         * searchQuery가 있다면 검색의 기능까지 수행<br>
         * GET /board<br>
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
         * GET /board<br>
         * response: {BoardDTO}
         */
        item: (boardId) => ({
            url: `/board/${boardId}`,
            method: "GET",
        }),

        /**
         * 게시글 수정 API<br>
         * PUT /board/{boardId}<br>
         * body: {BoardDTO}
         */
        put: (id) => ({
            url: `/board/${id}`,
            method: "PUT"
        }),
    },
    boardGroup: {
        /**
         * 게시판 그룹 목록 API<br>
         * GET /board/group<br>
         * response: {List<BoardGroupDTO>}
         */
        list: () => ({
            url: `/board/group`,
            method: "GET"
        }),

        /**
         * 게시판 그룹 생성 API<br>
         * POST /board/group<br>
         */
        insert: {
            url: `/board/group`,
            method: "POST"
        },

        /**
         * 게시판 그룹 구성원 목록 API<br>
         * GET /board/group/{groupId}/members<br>
         * response: {List<String>}
         */
        members: (groupId) => ({
            url: `/board/group/${groupId}/members`,
            method: "GET"
        }),

        /**
         * 게시판 그룹 구성원 수정 API<br>
         * PUT /board/group/{groupId}/members<br>
         */
        putMembers: (groupId) => ({
            url: `/board/group/${groupId}/members`,
            method: "PUT"
        }),

        /**
         * 게시판 그룹 수정 API<br>
         * PUT /board/group/{groupId}<br>
         */
        put: (groupId) => ({
            url: `/board/group/${groupId}`,
            method: "PUT"
        }),

        /**
         * 게시판 그룹 삭제 API<br>
         * DELETE /board/group/{groupId}<br>
         */
        delete: (groupId) => ({
            url: `/board/group/${groupId}`,
            method: "DELETE"
        }),
    },
    boardFile: {
        /**
         * 파일 다운로드 API<br>
         * GET /board/file/{fileSysName}<br>
         * response: attachment
         */
        download: (oriname, sysname) => ({
            url: `/board/file?sysname=${sysname}&oriname=${oriname}`,
            method: "GET"
        }),
        /**
         * 파일 삭제 API<br>
         * DB와 GCP 두곳에서 모두 삭제<br>
         * DELETE /board/file/{id}<br>
         */
        delete: (id) => ({
            url: `/board/file/${id}`,
            method: "DELETE"
        }),
    },
    boardComment: {
        /**
         * 댓글 작성 API<br>
         * POST /board<br>
         * body: {BoardCommentDTO}
         */
        insert: (boardId, refId) => ({
            url: `/board/${boardId}/comment/${refId}`,
            method: "POST"
        }),

        /**
         * 댓글 삭제 API<br>
         * DELETE /board/{boardId}/comment/{commentId}<br>
         */
        delete: (boardId, commentId) => ({
            url: `/board/${boardId}/comment/${commentId}`,
            method: "DELETE",
        }),
        /**
         * 댓글 수정 API<br>
         * PUT /board/{boardId}/comment/{commentId}<br>
         * body: {BoardCommentDTO}
         */
        put: (boardId, commentId) => ({
            url: `/board/${boardId}/comment/${commentId}`,
            method: "PUT",
        }),
    },
    approval: {
        /**
         * 결재 문서 작성 API<br>
         * POST /approval<br>
         * body: {ApprovalDTO, ApprovalLineDTO, files}
         */
        insert: () => ({
            url: `/approval`,
            method: "POST"
        }),

        /**
         * 결재 문서 수정 API<br>
         * PUT /approval<br>
         * body: {ApprovalDTO, ApprovalLineDTO, files}
         */
        put: (approvalId) => ({
            url: `/approval/${approvalId}`,
            method: "PUT"
        }),

        /**
         * 결재 문서 목록 조회 API<br>
         * GET /approval<br>
         * return: Map<String, Object>
         */
        getList: (currentPage, box, searchFilter, searchQuery) => {
            let url = `/approval?currentPage=${currentPage}&box=${box}`;

            if (searchQuery) {
                url += `&searchFilter=${searchFilter}&searchQuery=${searchQuery}`;
            }

            return {
                url: url,
                method: "GET",
            };
        },

        /**
         * 결재 문서 개별 조회 API<br>
         * GET /approval<br>
         * return: Map<String, Object>
         */
        getDetail: (approvalId) => ({
            url: `/approval/${approvalId}`,
            method: "GET"
        }),

        /**
         * 결재 문서 삭제 API<br>
         * DELETE /approval<br>
         * return: Map<String, Object>
         */
        delete: (approvalId) => ({
            url: `/approval/${approvalId}`,
            method: "DELETE"
        }),
    },
    approvalFile: {
        /**
         * 파일 삭제 API<br>
         * DELETE /approval/files/{fileId}<br>
         */
        delete: (fileId) => ({
            url: `/approval/files/${fileId}`,
            method: "DELETE"
        }),
    },
    approvalHistory: {
        /**
         * 결재 상태 기록 API<br>
         * POST /approval/{approvalId}/history<br>
         * body: {ApprovalHistoryDTO}
         */
        insert: (approvalId) => ({
            url: `/approval/${approvalId}/history`,
            method: "POST"
        }),
    },
    approvalDoctype: {
        /**
         * 결재문서 양식 목록 조회 API<br>
         * GET /approval/doctype<br>
         * response: {ApprovalDocTypeDTO}
         */
        getList: () => ({
            url: `/approval/doctype`,
            method: "GET"
        }),
    },
    approvalType: {
        /**
         * 결재 종류 목록 조회 API<br>
         * GET /approval/type<br>
         * response: {ApprovalTypeDTO}
         */
        getList: () => ({
            url: `/approval/type`,
            method: "GET"
        }),
    },
    calendar: {
        /**
         * 개인일정 목록 조회 API<br>
         * GET /calendar<br>
         * response: {List<CalendarDTO>}
         */
        getList: () => ({
            url: `/calendar`,
            method: "GET"
        }),
        /**
         * 개인일정 생성 API<br>
         * POST /calendar<br>
         * body: {CalendarDTO}
         */
        insert: () => ({
            url: `/calendar`,
            method: "POST"
        }),
        /**
         * 개인일정 수정 API<br>
         * GET /calendar/{calendarId}<br>
         * body: {CalendarDTO}
         */
        update: (calendarId) => ({
            url: `/calendar/${calendarId}`,
            method: "PUT"
        }),
        /**
         * 개인일정 삭제 API<br>
         * DELETE /calendar/{calendarId}<br>
         */
        delete: (calendarId) => ({
            url: `/calendar/${calendarId}`,
            method: "DELETE"
        }),
    },
    calendarGroup: {
        /**
         * 그룹일정 목록 조회 API<br>
         * GET /calendar/group/{groupId}<br>
         * response: {List<CalendarDTO>}
         */
        getCalendarList: (groupId) => ({
            url: `/calendar/group/${groupId}`,
            method: "GET"
        }),
        /**
         * 일정 그룹 목록 조회 API<br>
         * GET /calendar/group/<br>
         * response: {List<CalendarGroupDTO>}
         */
        getGroupList: () => ({
            url: `/calendar/group`,
            method: "GET"
        }),
        /**
         * 일정 그룹 생성 API<br>
         * POST /calendar/group<br>
         * body: {CalendarGroupDTO}
         */
        insert: () => ({
            url: `/calendar/group`,
            method: "POST"
        }),
        /**
         * 일정 그룹 수정 API<br>
         * GET /calendar/group/{groupId}<br>
         * body: {CalendarGroupDTO}
         */
        update: (groupId) => ({
            url: `/calendar/group/${groupId}`,
            method: "PUT"
        }),
        /**
         * 일정 그룹 삭제 API<br>
         * DELETE /calendar/group/{groupId}<br>
         */
        delete: (groupId) => ({
            url: `/calendar/group/${groupId}`,
            method: "DELETE"
        }),

        /**
         * 일정 그룹 구성원 목록 API<br>
         * GET /board/group/{groupId}/members<br>
         * response: {List<String>}
         */
        members: (groupId) => ({
            url: `/calendar/group/${groupId}/members`,
            method: "GET"
        }),

        /**
         * 일정 그룹 구성원 수정 API<br>
         * PUT /calendar/group/{groupId}/members<br>
         */
        putMembers: (groupId) => ({
            url: `/calendar/group/${groupId}/members`,
            method: "PUT"
        }),
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
        insert: {
            url: `/project`,
            method: "POST",
        },
        update: (projectId) => ({
            url: `/project/${projectId}`,
            method: "PUT"
        }),

        syncMembers: (projectId) => ({
            url: `/project/${projectId}/members`,
            method: "POST",
        })
    },
    task: {
        insert: {
            url: `/project/task`,
            method: "POST",
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
            method: "DELETE",
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
        myReservationList: {url: "/reservations/my", method: "GET"},
    },
    resource: {

        /**
         * 예약에 쓰이는 리소스 추가 API<br>
         * POST /reservations/resource <br>
         *
         */
        insert: {
            url: "/reservations/resource",
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
        delete: {},
        update: {},

        /**
         * 예약에 사용할 전체 리소스 리스트를 가져오는 API<br>
         * GET /reservations/resource <br>
         * response: {List<ResourceDto>}
         */
        resourceList: {url: "/reservations/resource", method: "GET"},
    },
    selectedEmployee: {
        /**
         * 현재 사용자 정보 조회 API<br>
         * GET /employee/me<br>
         * response: {EmployeeDTO}
         */
        me: {url: `/employee/me`, method: "GET"},

        /**
         * 사용자 정보 수정 API<br>
         * PUT /employee<br>
         * body: {EmployeeDTO}
         */
        put: {url: `/employee`, method: "PUT"},

        /**
         * 비밀번호 변경 API<br>
         * PUT /employee/password/{id}<br>
         * body: {EmployeeDTO}<br>
         * response: {errorMessage: string}
         */
        passwordChange: (empId) => ({
            url: `/employee/password/${empId}`,
            method: "PUT",
        }),

        /**
         * 직원 목록 조회 API<br>
         * GET /employee<br>
         * response: List<EmployeeDTO>
         */
        list: {url: `/employee`, method: "GET"},

        /**
         * 직원 상세 조회 API<br>
         * GET /employee/{id}<br>
         * response: EmployeeDTO
         */
        detail: (empId) => ({
            url: `/employee/${empId}`,
            method: "GET",
        }),

        /**
         * 이메일용 아이디 중복확인 API<br>
         * GET /employee/duplcheck?email={email}<br>
         */
        duplcheck: (email, phone) => ({
            url: `/employee/duplcheck?email=${email}&phone=${phone}`,
            method: "GET",
        }),
    },
    hrMeta: {
        /**
         * 부서 목록 조회 API<br>
         * GET /hr-meta/departments<br>
         * response: DepartmentDTO
         */
        departments: {url: `/hr-meta/departments`, method: "GET"},

        /**
         * 직급 목록 조회 API<br>
         * GET /hr-meta/jobs<br>
         * response: JobDTO
         */
        jobs: {url: `/hr-meta/jobs`, method: "GET"},

        /**
         * 조직 목록 조회 API<br>
         * GET /hr-meta/organizations<br>
         * response: OrganizationDTO
         */
        organizations: {url: `/hr-meta/organizations`, method: "GET"},

        structure: {url: `/hr-meta/org-structure `, method: "GET"}
    },

    mail:{
      sendMail: (formData) => ({
        url: "/mail/send",
        method: "POST",
        data: formData,
      }),
      // folder, email
      getList: (folder = "all", email) => ({
        url: `/mail/${folder}`,
        method: "GET",
        params: { email },
      }),
      getDetail: (id) => ({
        url: `/mail/detail/${id}`,
        method: "GET",
      }),
      changeReceiverStatus: () => ({
        url: "/mail/receiver/status",
        method: "POST",
      }),
      deleteReceiver: (id) => ({
        url: `/mail/receiver/${id}`,
        method: "DELETE",
      })

    },

    address: {
        getGroupType: {
            url: "/address/group-type",
            method: "GET",
        },

        getSubGroup: {
            url: "/address/group",
            method: "GET",
        },

        createSubGroup: (groupName) => ({
            url: "/address/insert-group",
            method: "POST",
            data: {groupName},
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

        // 주소록 수정
        updateAddress: (addressId) => ({
            method: "put",
            url: `/address/update-address/${addressId}`,
        }),

        // 주소록 삭제
        deleteAddress: (addressId) => ({
            method: "delete",
            url: `/address/delete-address/${addressId}`,
        }),

        // 공유 주소록 클릭하면 부서 그룹 가져오기
        getDepartments: () => ({
            url: `/address/departments`,
            method: "GET",
        }),

        // 공유주소록 소분류 부서 클릭 시 부서 내 직원 정보
        getSharedAddresses: (code) => ({
            url: `/address/shared/${code}`,
            method: "GET",
        })
    },
    chat: {
        /**
         * 채팅 메시지 전송 API<br>
         * POST /workspace/{workspaceId}/channel/{channelId}/send<br>
         * body: {ChatMessageDTO}
         */
        sendMessage: (workspaceId, channelId) => ({
            url: `/workspace/${workspaceId}/channel/${channelId}/send`,
            method: "POST",
        }),

        /**
         * 채널 메시지 리스트 조회 API<br>
         * GET /workspace/{workspaceId}/channel/{channelId}/messages<br>
         * response: List<ChatMessageDTO>
         */
        list: (workspaceId, channelId) => ({
            url: `/workspace/${workspaceId}/channel/${channelId}/message`,
            method: "GET",
        }),

        oldlist: (workspaceId, channelId, oldestId) => ({
            url: `/workspace/${workspaceId}/channel/${channelId}/message/older?beforeId=${oldestId}`,
            method: "GET"
        }),

        /**
         * 워크스페이스 생성
         */
        createWorkspace: () => ({
            url: `/workspace`,
            method: "POST",
        }),

        /**
         * 채널 생성
         */
        createChannel: (workspaceId) => ({
            url: `/workspace/${workspaceId}/channels`,
            method: "POST",
        }),
        /**
         * 채널 제목 정보 수정
         */
        updateChannel: (workspaceId, channelId) => ({
            url: `/workspace/${workspaceId}/channels/${channelId}`,
            method: "PATCH",
        }),

        /**
         * 채널 제목 정보 수정
         */
        updateWorkspace: (workspaceId) => ({
            url: `/workspace/${workspaceId}`,
            method: "PATCH",
        }),

        /**
         * 워크스페이스 목록 조회
         */
        listWorkspaces: () => ({
            url: `/workspace`,
            method: "GET",
        }),

        /**
         * 워크스페이스 내 채널 목록 조회
         */
        listChannels: (workspaceId) => ({
            url: `/workspace/${workspaceId}/channels`,
            method: "GET",
        }),

        /**
         * 워크스페이스 멤버 조회
         */
        listWorkspaceMembers: (workspaceId) => ({
            url: `/workspace/${workspaceId}/members`,
            method: "GET",
        }),

        /**
         * 채널 참가자 조회
         */
        listChannelParticipants: (workspaceId, channelId) => ({
            url: `/workspace/${workspaceId}/channels/${channelId}/members`,
            method: "GET",
        }),
        /**
         * 채널 참가자 싱크 수정
         */
        syncChannelMembers: (workspaceId, channelId) => ({
            url: `/workspace/${workspaceId}/channels/${channelId}/members`,
            method: "POST"
        }),
        /**
         * 워크스페이스 참가자 싱크 수정
         */
        syncWorkspaceMembers: (workspaceId) => ({
            url: `/workspace/${workspaceId}/members`,
            method: "POST"
        }),
        /**
         * DM 채널 조회하거나 생성
         */
        directChannel: (workspaceId) => ({
            url: `workspace/${workspaceId}/dm`,
            method: "POST"
        }),

        deleteFile: () => ({
            url: 'chat/delete',
            method: "DELETE"
        }),
        isMyChannel: (workspaceId, channelId) => ({
            url: `/workspace/${workspaceId}/channels/${channelId}/myChannel`,
            method:'GET'
        })

    },
    file: {
        /**
         * 파일 업로드 API<br>
         * POST /file/upload?folder={path}<br>
         * body: MultipartFile<br>
         * response: {url: string}
         */
        upload: (folder) => ({
            url: `/file/upload?folder=${folder}`,
            method: "POST",
        }),

        /**
         * 파일 삭제 API<br>
         * DELETE /file/delete?file= {sysName}<br>
         */
        delete: (sysName) => ({
            url: `/file/delete`,
            method: "DELETE",
        }),
        download: (sysName) => ({
            url: `/file/download?file=${sysName}`,
            method: "GET"
        })
    },
    dashboard: {
        /**
         * 대시보드 필요한 정보 조회 API<br>
         * GET /dashboard<br>
         * response:
         *  pendingApprovalCount,
         *  recentApprovalHistory,
         *  recentNotification,
         *  todayScheduleSize,
         *  upcomingScheduleList
         */
        getInfos: () => ({
            url: `/dashboard`,
            method: "GET",
        }),
    },

    // 근무 관리
    workmanagement: {
        /**
         * 근무기록 저장 API
         * POST /worktimelog
         * body: {workTimeLogDTO}
         */
        insert: {url: `/worktimelog`, method: "POST"},

        /**
         * 근무기록 수정 API<br>
         * PUT /worktimelog/{employeeId}<br>
         * body: {workTimeLogDTO}
         */
        put: (employeeId) => ({
            url: `/worktimelog/${employeeId}`,
            method: "PUT"
        }),

        /**
         * 내 근무기록 리스트 조회 API
         * GET /worktimelog
         * response: List<WorkTimeLogDTO>
         */
        getWorkTimeLogsByEmployeeIdAPI: {url: `/worktimelog`, method: "GET"},

        /**
         * 기간별 근무기록 리스트 조회 API
         * GET /worktimelog?startDate=${startDate}&endDate=${endDate}
         * response: WorkTimeLogDTO
         */
        listByPeriod: (startDate, endDate) => ({
            url: `/worktimelog?startDate=${startDate}&endDate=${endDate}`,
            method: "GET",
        }),

        /**
         * 근무유형별 근무기록 리스트 조회 API
         * GET /worktimelog?type=${type}
         * response: WorkTimeLogDTO
         */
        getlistByType: (type) => ({
            url: `/worktimelog?type=${type}`,
            method: "GET",
        }),

        /**
         * 기간 + 근무유형 조건으로 근무기록 리스트 조회 API
         * GET /worktimelog/typeAndPeriod?startDate=${startDate}&endDate=${endDate}&type=${type}
         * response: WorkTimeLogDTO
         */
        getlistByTypeAndPeriod: (startDate, endDate, type) => ({
            url: `/worktimelog/typeAndPeriod?startDate=${startDate}&endDate=${endDate}&type=${type}`,
            method: "GET",
        }),

        /**
         * 근무기록 단일 조회 API
         * GET /worktimelog/${id}
         * response: WorkTimeLogDTO
         */
        itemById: (id) => ({
            url: `/worktimelog/${id}`,
            method: "GET",
        }),

        /**
         * 근무 통계 조회 (기간 단위 자유)
         * GET /worktimelog/summary?&startDate=${startDate}&endDate=${endDate}
         * Query Params:
         *  - startDate : 조회 시작일 (YYYY-MM-DD)
         *  - endDate   : 조회 종료일 (YYYY-MM-DD)
         *
         * Response: WorkSummaryDTO
         */
        getWorkSummary: {url: `/worksummarydaily/summary`, method: "GET"},

        /**
         * 근무 통계 조회 (기간 단위 자유)
         * GET /worktimelog/attendance?period=${period}&startDate=${startDate}&endDate=${endDate}
         * Query Params:
         *  - startDate : 조회 시작일 (YYYY-MM-DD)
         *  - endDate   : 조회 종료일 (YYYY-MM-DD)
         *
         * Response: WorkAttendanceSummaryDTO
         */
        getWorkAttendanceAPI: {url: `/worksummarydaily/attendance`, method: "GET"},

        /**
         * 근무현황 기록 유형 목록 조회 API<br>
         * GET /workmanagement/worktimetype<br>
         * response: WorkTimeTypeDTO
         */
        getAllWorkTimeTypes: {url: `/workmanagement/worktimetype`, method: "GET"},


        /**
         * 잔여 휴가일수 조회 API<br>
         * GET /workmanagement/vacation/remaining<br>
         * response: Integer
         */
        getRemainingVacation: {url: `/workmanagement/vacation/remaining`, method: "GET"},

        /**
         * 기간별 근무 계획 조회 API<br>
         * GET /workmanagement/plan/list<br>
         * response: WorkPlanDTO
         */
        getWorkPlanByPeriod: {url: `/workmanagement/plan/list`, method: "GET"},
    },

    // 법정 공휴일, 회사기념일 등 쉬는 날
    holiday: {
        /**
         * 기간별 공휴일 + 회사 기념일 리스트 조회 API
         * GET /holiday/list?startDate=${startDate}&endDate=${endDate}
         * response: HolidayCalendarDTO
         */
        getHolidaysByPeriod: (startDate, endDate) => ({
            url: `/holiday/list?startDate=${startDate}&endDate=${endDate}`,
            method: "GET",
        })
    },

};

export default apiRoutes;