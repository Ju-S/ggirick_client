# [2차 프로젝트: 기업 관리 전산 프로젝트 (그룹웨어)](https://ggirick.site)

## 프로젝트 기간
2025.10.13 - 2025.11.05

## 프로젝트 목표
- 기업용 회원가입 시스템 구축
- 조직 그룹별 게시판 기능 개발
- 기업용 전자결재 시스템 개발
- 기업용 개인 및 팀별 일정 관리 시스템 개발
- 기업용 근무 관리 시스템 개발
- 기업용 리소스 예약 관리 시스템 개발
- 기업용 프로젝트/업무 관리 시스템 개발
- 기업용 메일 서버 연동 및 송수신 메일함 개발
- 기업용 개인 및 공유 주소록 개발
- 기업용 슬랙형 채팅 메신저 개발
- 기업용 화상회의 개발
- 기업용 조직도 개발
- 그룹웨어 메인화면을 통한 접근성 향상
- 사용자 선호에 따른 테마 선택 기능
- 안정적인 데이터 관리를 위한 관리자 시스템 구축

## 프로젝트 시나리오

### 가정
- 실제 기업에서 사용할 법한 그룹웨어 사이트를 구축

### 대상
- 그룹웨어를 실무에서 사용하고 적용할 법한 근무자 및 관리자

### 세부내용
- **회원 관리**: 관리자 발급 아이디/비밀번호로 로그인 후 개인정보 및 비밀번호 수정 가능, 접속 회원 제한
- **게시판**: 전사 공지 및 그룹 게시판, 글작성/첨부파일/대댓글 작성 가능, 공지글 상단 고정
- **전자결재**: 기안서 작성, 결재선 등록, 승인/반려/대결 기능, 문서 보관
- **일정**: 개인/그룹 일정 관리, 반복 일정 지원, 캘린더 표시
- **근무처리**: 출퇴근 체크, 외근/휴가/업무 기록, 주간/월간 근무 현황 확인
- **예약**: 사내 리소스 예약 관리, 캘린더 기반, 중복 예약 불가
- **업무관리**: 프로젝트/할 일 관리, 칸반/테이블/간트/캘린더 뷰 지원, 실시간 반영
- **메일**: hMailServer 연동 메일 송수신, 임시/중요 메일 분류
- **주소록**: 공유/개인 주소록 관리, 팀별 연락처 조회 가능
- **메신저**: STOMP 기반 워크스페이스-채널 구조, 채팅, 파일함, 반응 기능, 1:1 메시지 지원
- **화상회의**: openvidu3 / liveKit 기반, 화면 공유, 손들기, 채팅 가능
- **조직도**: 팀별/직무별 트리 구조로 직원 표기
- **홈 대시보드**: 최신화된 일정, 결재, 공지, 근무 현황 모아보기, 주요 기능 바로가기

## 프로젝트 수행 요건

### 회원가입 및 계정 관리
- 회원가입, 로그인, 로그아웃 기능 구현
- 비밀번호 암호화(Bcrypt, SHA256 등)로 안전 관리
- 관리자 서버에서 발급한 아이디/비밀번호로 1차 로그인 후 개인 비밀번호 변경 가능

### 홈 화면
- 최신화된 일정, 결재, 공지, 근무 등 즉시 확인
- 테마 선택 기능 지원

### 게시판 기능
- 글 작성/수정/삭제, 댓글/대댓글 작성
- 첨부파일 지원
- 전사 게시판과 그룹 게시판 구분

### 전자결재 시스템
- 진행중 문서 관리: 전체, 대기, 진행중
- 보관 문서 관리: 전체, 기안, 결재, 반려
- 결재선 등록 인원 승인/반려/의견 제출, 필요 시 대결 가능
- 최종 결재 완료 문서에 따른 업무 로직 수행

### 일정 시스템
- 일정 추가/수정/삭제
- 반복 일정 지원, 개인 색상 표시
- 개인/공유 일정 구분

### 근무처리 시스템
- 출근/퇴근, 외근/외출/회의/업무 버튼
- 근무계획 자동 연동
- 휴가 시작/종료일, 시간 적용
- 월별 근무 현황 표시

### 예약 시스템
- 리소스 선택 후 시간대 예약 가능
- 캘린더에서 리소스별 예약 확인
- 중복 예약 불가
- 타인의 예약 수정/삭제 불가

### 업무관리 시스템
- 프로젝트 > 할 일 관리
- 할 일은 프로젝트 내 담당자 배정 필수
- 상태: [할일], [진행중], [완료]
- 실시간 반영

### 메일 및 주소록 시스템
- 주소록에서 이메일 가져오기 가능
- 공유 주소록: 같은 조직 사용자는 동일 데이터 사용

### 채팅 및 화상회의 시스템
- 워크스페이스 가입 전 채널 참여 불가
- 빈 메시지 전송 불가
- 1:1 메시지 자동 채널 생성
- 화상회의: 화면 공유, 손들기, 채팅 가능

### 조직도
- 직위별 직원 목록 확인

### 관리자 및 운영자 기능
- 직원 관리, 부서/조직 추가 및 삭제
- 공휴일 테이블 기반 주간 근무 현황 표시

## ERD
[ERD 다이어그램 보기](https://dbdiagram.io/d/%EB%81%BC%EB%A6%AD%EB%81%BC%EB%A6%AD-68d334687c85fb99610ac7bb)
![ERD](./public/screenshots/끼릭끼릭ERD.svg)

## 화면 예시
### 회원가입 및 계정 관리
![회원가입](./public/screenshots/registrypage.png)
![로그인](./public/screenshots/loginpage.png)
![마이페이지](./public/screenshots/mypage.png)

### 홈 화면
![대시보드](./public/screenshots/dashboard.png)

### 게시판 기능
![게시판](./public/screenshots/boardpage.png)
![게시판 글쓰기](./public/screenshots/boardwrite.png)
![게시판 개별 글](./public/screenshots/boarddetail.png)
![게시판 그룹 추가](./public/screenshots/boardgroup.png)
![게시판 그룹원 추가](./public/screenshots/boardgroupadd.png)

### 전자결재 시스템
![전자결제](./public/screenshots/approvalpage.png)
![전자결제 기안하기](./public/screenshots/approvalwrite.png)
![전자결재 개별 글](./public/screenshots/approvaldetail.png)

### 일정 시스템
![일정](./public/screenshots/calendarpage.png)
![개별 일정](./public/screenshots/calendardetail.png)
![일정 추가](./public/screenshots/calendaradd.png)
![일정 수정](./public/screenshots/calendaredit.png)

### 근무처리 시스템
![근무처리](./public/screenshots/workmanagementpage.png)

### 예약 시스템
![예약](./public/screenshots/reservationpage.png)
![예약 리소스 목록](./public/screenshots/reservationlist.png)

### 업무관리 시스템
![업무관리 칸반](./public/screenshots/taskpage.png)
![업무관리 테이블](./public/screenshots/taskpagetable.png)
![업무관리 간트](./public/screenshots/taskpagegant.png)
![업무관리 캘린더](./public/screenshots/taskpagecalendar.png)
![업무관리 DB](./public/screenshots/taskpageDB.png)
![업무관리 추가](./public/screenshots/taskadd.png)

### 메일 및 주소록 시스템
![메일](./public/screenshots/mailpage.png)
![개별 메일](./public/screenshots/maildetail.png)
![메일 쓰기](./public/screenshots/mailwrite.png)

### 채팅 및 화상회의 시스템
![채팅](./public/screenshots/chatpage.png)
![채팅 디테일](./public/screenshots/chatdetail.png)
![채팅 파일](./public/screenshots/chatfile.png)
![채팅 영상](./public/screenshots/chatvideo.png)
![채팅 워크스페이스](./public/screenshots/chatworkspacememberadd.png)
![채팅 쓰기](./public/screenshots/chatwrite.png)
![화상채팅](./public/screenshots/videochat.png)

### 조직도
![조직도](./public/screenshots/organizationpage.png)

### 관리자 및 운영자 기능
![관리자 hr관리](./public/screenshots/hrsystem.png)
![관리자 부서관리](./public/screenshots/deptmanagement.png)
![관리자 휴일관리](./public/screenshots/managementholiday.png)
![관리자 휴일적용](./public/screenshots/holidaysubmit.png)
![관리자 시스템관리](./public/screenshots/systemmanagementpage.png)
![관리자 직급관리](./public/screenshots/modifyrank.png)
![관리자 첫비밀번호](./public/screenshots/firstpasswordwarn.png)
