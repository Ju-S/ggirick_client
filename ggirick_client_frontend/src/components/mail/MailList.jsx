
import{useState} from "react";


export default function MailList(){
    const [mails] = useState([
        { sender: "김철수", important: true, tag: "업무", subject: "Q4 프로젝트 진행 상황 보고", body: "안녕하세요, 4분기 프로젝트의 현재 진행 상황에 대해 보고드립니다...", date: "2025-10-14 오전 10:30", attachment: true },
        { sender: "이영희", important: true, tag: "중요", subject: "회의 일정 변경 안내", body: "내일 예정된 회의 일정이 변경되었습니다. 새로운 일정은...", date: "2025-10-14 오전 9:15", attachment: false },
        { sender: "박민수", important: false, tag: "디자인", subject: "디자인 검토 요청", body: "새로운 디자인 시안을 첨부합니다. 검토 후 피드백 부탁드립니다...", date: "2025-10-13", attachment: true },
        { sender: "최지훈", important: false, tag: "개인", subject: "점심 약속", body: "내일 점심 같이 하실래요? 새로 생긴 레스토랑에 가보려고...", date: "2025-10-13", attachment: false },
        { sender: "정수진", important: true, tag: "업무", subject: "월간 보고서 제출", body: "이번 달 월간 보고서를 제출합니다. 검토 부탁드립니다...", date: "2025-10-12", attachment: true },
        { sender: "강민지", important: false, tag: "휴가", subject: "휴가 신청서", body: "다음 주 휴가를 신청하고자 합니다...", date: "2025-10-12", attachment: false },
        { sender: "한동욱", important: false, tag: "스팸", subject: "긴급! 당첨을 축하드립니다", body: "축하합니다! 고객님께서 100만원에 당첨되었습니다. 즉시 확인하세요...", date: "2025-10-11", attachment: false },
        { sender: "오세훈", important: true, tag: "업무", subject: "고객 미팅 일정 안내", body: "이번 주 금요일에 고객 미팅 일정이 잡혔습니다. 준비사항 확인 부탁드립니다...", date: "2025-10-10", attachment: false },
        { sender: "김나영", important: false, tag: "교육", subject: "온라인 교육 자료 공유", body: "지난 교육 세션의 자료를 공유드립니다. 참고해주세요...", date: "2025-10-10", attachment: true },
        { sender: "이동현", important: true, tag: "업무", subject: "서버 점검 안내", body: "이번 주 토요일 서버 점검이 예정되어 있습니다. 서비스 이용에 참고 바랍니다...", date: "2025-10-09", attachment: false }
    ]);

    // ✅ 선택된 메일 상태
    const [selectedMail, setSelectedMail] = useState(null);

    return (
        <div className="flex h-screen m-2 bg-gray-50">
            {/* ===== 왼쪽: 메일 리스트 ===== */}
            <div className="w-1/2 border-r ">
                <h1 className="text-xl font-bold p-4">메일함</h1>
                <ul className="divide-y divide-gray-200">
                    {mails.map((mail, index) => (
                        <li
                            key={index}
                            onClick={() => setSelectedMail(mail)} // ✅ 클릭 시 선택
                            className={`py-3 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                                selectedMail === mail ? "bg-blue-50" : ""
                            }`}
                        >
                            <div className="flex flex-col">
                <span className="font-semibold">
                  {mail.subject} {mail.important && <span className="text-red-500">●</span>}
                </span>
                                <span className="text-gray-500 text-sm">
                  {mail.sender} · {mail.date}
                </span>
                                <span className="text-gray-700 text-sm truncate">{mail.body}</span>
                            </div>
                            {mail.attachment && <span className="ml-2 text-blue-500">📎</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ===== 오른쪽: 메일 세부 내용 ===== */}
            <div className="flex-1 p-6 m-2">
                {selectedMail ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedMail.subject}</h2>
                        <div className="text-sm text-gray-500 mb-4">
                            {selectedMail.sender} · {selectedMail.date} · {selectedMail.tag}
                        </div>
                        <p className="text-gray-800 leading-relaxed">{selectedMail.body}</p>
                        {selectedMail.attachment && (
                            <div className="mt-4 text-blue-600">📎 첨부파일이 있습니다.</div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-400 text-center mt-40">메일을 선택하세요 📩</div>
                )}
            </div>
        </div>
    );
}