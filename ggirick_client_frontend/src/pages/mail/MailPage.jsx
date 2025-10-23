import MailSidebar from "../../components/mail/MailSidebar.jsx";

import MailMain from "@/components/mail/MailMain.jsx";


export default function MailPage() {
    return (
      <main className="min-h-screen max-h-screen flex flex-col p-4 pt-20 md:ml-64 bg-base-200">
        <div className="flex-1 grid grid-cols-6 gap-4 ">
          {/* ------------------- 사이드 네비게이션 ------------------- */}
          <aside
            className="col-span-1 rounded-lg">
            <MailSidebar/>
          </aside>

          {/* ------------------- 메인 영역 ------------------- */}
          <section className="col-span-5 rounded-lg">
            <MailMain />
          </section>
        </div>
      </main>
    );
}