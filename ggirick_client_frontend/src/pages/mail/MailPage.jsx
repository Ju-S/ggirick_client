import { useState } from "react";
import MailSidebar from "../../components/mail/MailSidebar.jsx";
import MailMain from "@/components/mail/MailMain.jsx";
import MailWrite from "@/components/mail/MailWrite.jsx";

export default function MailPage() {
  // 상태: 'main'이면 메일 목록, 'write'이면 메일 작성
  const [mainView, setMainView] = useState("main");

  return (
    <main className="min-h-screen max-h-screen flex flex-col p-4 pt-20 md:ml-64 bg-base-200">
      <div className="flex-1 grid grid-cols-6 gap-4 ">
        {/* ------------------- 사이드 네비게이션 ------------------- */}
        <aside className="col-span-1 rounded-lg">
          {/* MailSidebar에 setMainView 전달 */}
          <MailSidebar onSelectFolder={() => setMainView("main")} onCompose={() => setMainView("write")} />
        </aside>

        {/* ------------------- 메인 영역 ------------------- */}
        <section className="col-span-5 rounded-lg">
          {mainView === "main" && <MailMain />}
          {mainView === "write" && <MailWrite />}
        </section>
      </div>
    </main>
  );
}