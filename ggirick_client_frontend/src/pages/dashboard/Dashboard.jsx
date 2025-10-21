import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Clock from "@/components/dashboard/Clock.jsx";
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="h-auto min-h-screen p-4 pt-20 md:ml-64 bg-base-200">
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-16 rounded-lg md:h-24">
          <Card
            onClick={() => navigate("mail")}
            className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
          >
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-1">
                <span className="text-sm text-base-content-900">
                  읽지 않은 메일
                </span>
                <span className="mt-2 text-2xl text-base-content-900">
                  5
                </span>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-mail-icon lucide-mail h-6 w-6 text-info-content"
                  >
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="h-16 rounded-lg md:h-24">
            <Card
                onClick={() => navigate("mail")}
                className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
            >
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-1">
                <span className="text-sm text-base-content-900">
                  오늘 일정
                </span>
                <span className="mt-2 text-2xl text-base-content-900">
                  3
                </span>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-calendar-icon lucide-calendar h-6 w-6 text-success-content"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="h-16 rounded-lg md:h-24">
            <Card
                onClick={() => navigate("mail")}
                className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
            >
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-1">
                <span className="text-sm text-base-content-900">
                  대기 중인 결재
                </span>
                <span className="mt-2 text-2xl text-base-content-900">
                  2
                </span>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-signature-icon lucide-signature h-6 w-6 text-warning-content"
                  >
                    <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
                    <path d="M3 21h18" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="h-16 rounded-lg md:h-24">
            <Card
                onClick={() => navigate("mail")}
                className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100 hover:!bg-base-300"
            >
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-1">
                <span className="text-sm text-base-content-900">
                  새 메시지
                </span>
                <span className="mt-2 text-2xl text-base-content-900">
                  12
                </span>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg !bg-error/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-message-square-more-icon lucide-message-square-more h-6 w-6 text-error-content"
                  >
                    <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                    <path d="M12 11h.01" />
                    <path d="M16 11h.01" />
                    <path d="M8 11h.01" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="h-48 rounded-lg md:h-80">
          <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
            <div className="flex items-start justify-start">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calendar-icon text-base-content-800 h-6 w-6"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  <span className="text-m text-base-content-900">
                    오늘의 일정
                  </span>
                </div>
                <Card
                  onClick={() => navigate("calendar")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  일정 1
                </Card>
                <Card
                  onClick={() => navigate("calendar")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  일정 2
                </Card>
                <Card
                  onClick={() => navigate("calendar")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  일정 3
                </Card>
                <button
                  onClick={() => navigate("calendar")}
                  className="h-8 w-full rounded-lg border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  전체 일정 보기
                </button>
              </div>
            </div>
          </Card>
        </div>
        <div className="h-48 rounded-lg md:h-80">
          <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
            <div className="flex items-start justify-start">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calendar-icon text-base-content-800 h-6 w-6"
                  >
                    <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
                    <path d="M3 21h18" />
                  </svg>
                  <span className="text-m text-base-content-900">
                    최근 결재 현황
                  </span>
                </div>
                <Card
                  onClick={() => navigate("approval")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  결재 1
                </Card>
                <Card
                  onClick={() => navigate("approval")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  결재 2
                </Card>
                <Card
                  onClick={() => navigate("approval")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  결재 3
                </Card>
                <button
                  onClick={() => navigate("approval")}
                  className="h-8 w-full rounded-lg border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  전체 결재 보기
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-3 gap-4">
        <div className="col-span-2 h-32 rounded-lg md:h-72">
          <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
            <div className="flex items-start justify-start">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trending-up-icon text-base-content-800 h-6 w-6"
                  >
                    <path d="M16 7h6v6" />
                    <path d="m22 7-8.5 8.5-5-5L2 17" />
                  </svg>
                  <span className="text-m text-base-content-900">
                    최근 활동
                  </span>
                </div>
                <Card
                  onClick={() => navigate("drive")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  최과장님이 문서를 업로드했습니다.
                </Card>
                <Card
                  onClick={() => navigate("board")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-8000"
                >
                  오과장님이 공지를 등록했습니다.
                </Card>
                <Card
                  onClick={() => navigate("calendar")}
                  className="h-14 w-full rounded-lg shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                >
                  이사원님이 일정을 추가했습니다.
                </Card>
              </div>
            </div>
          </Card>
        </div>
        <div className="h-32 rounded-lg md:h-72">
          <Card className="h-full w-full rounded-lg shadow-sm border-none !bg-base-100">
            <div className="flex items-start justify-start">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clipboard-clock-icon lucide-clipboard-clock text-base-content-800 h-6 w-6"
                  >
                    <path d="M16 14v2.2l1.6 1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v.832" />
                    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
                    <circle cx="16" cy="16" r="6" />
                    <rect x="8" y="2" width="8" height="4" rx="1" />
                  </svg>
                  <span className="text-m text-base-content-900">
                    출/퇴근 기록
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Clock/>
                  <div className="inline-grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                    </div>
                    <Card
                      onClick={() => navigate("")}
                      className="h-24 w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                    >
                      출근<br/>
                      <span className="text-sm">08:56:24</span>
                    </Card>
                    <Card
                      onClick={() => navigate("")}
                      className="h-24 w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                    >
                      퇴근<br/>
                      <span className="text-sm">00:00:00</span>
                    </Card>
                    <Card
                      onClick={() => navigate("")}
                      className="h-12 w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                    >
                      업무
                    </Card>
                    <Card
                      onClick={() => navigate("")}
                      className="h-12 w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                    >
                      외출
                    </Card>
                    <Card
                      onClick={() => navigate("")}
                      className="h-12 w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                    >
                      회의
                    </Card>
                    <Card
                      onClick={() => navigate("")}
                      className="h-12 w-full rounded-lg text-center shadow-none border !border-base-300 !bg-base-100 hover:!bg-base-300 text-base-content-800"
                    >
                      외근
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
