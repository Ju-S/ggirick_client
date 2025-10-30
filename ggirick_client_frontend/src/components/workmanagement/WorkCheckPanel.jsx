import React from "react";

export default function WorkCheckPanel({
                                           time,
                                           workTimeTypes,
                                           hasCheckedIn,
                                           hasCheckedOut,
                                           currentStatus,
                                           handleCheck,
                                       }) {
    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center">
                <h3 className="font-semibold text-base mb-4 flex justify-center items-center gap-2">
                    근무체크
                    {currentStatus && (
                        <span className={`badge badge-soft ${getBadgeColor(currentStatus)} font-semibold`}>
              {["출근", "퇴근"].includes(currentStatus) ? currentStatus : `${currentStatus}중`}
            </span>
                    )}
                </h3>

                <div className="text-5xl font-bold text-primary mb-3">{time}</div>

                <div className="flex justify-center gap-4 mb-4">
                    <button
                        className={`btn btn-soft btn-primary text-primary hover:text-white transition-all ${
                            hasCheckedIn || hasCheckedOut ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleCheck("IN")}
                        disabled={hasCheckedIn || hasCheckedOut}
                    >
                        출근하기
                    </button>

                    <button
                        className={`btn btn-soft btn-error text-error hover:text-white transition-all ${
                            !hasCheckedIn || hasCheckedOut ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleCheck("OUT")}
                        disabled={!hasCheckedIn || hasCheckedOut}
                    >
                        퇴근하기
                    </button>
                </div>

                <div className="flex justify-center gap-2 mb-3">
                    {workTimeTypes
                        .filter((t) => !["IN", "OUT", "LEAVE"].includes(t.type))
                        .map((type) => (
                            <button
                                key={type.type}
                                className={`btn btn-outline btn-xs transition-all ${
                                    !hasCheckedIn || hasCheckedOut ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={() => handleCheck(type.type)}
                                disabled={!hasCheckedIn || hasCheckedOut}
                            >
                                {type.name}
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}

// 뱃지 색상 분리
function getBadgeColor(status) {
    switch (status) {
        case "출근": return "badge-primary";
        case "퇴근": return "badge-error";
        case "업무": return "badge-info";
        case "회의": return "badge-accent";
        case "외근": return "badge-warning";
        case "외출": return "badge-neutral";
        default: return "badge-ghost";
    }
}
