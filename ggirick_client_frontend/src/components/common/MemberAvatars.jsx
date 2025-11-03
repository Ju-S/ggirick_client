import React, { useState } from "react";

const MAX_VISIBLE = 4;

export default function MemberAvatars({ activeMembers }) {
    const [hover, setHover] = useState(false);

    const visibleMembers = activeMembers.slice(0, MAX_VISIBLE);
    const hiddenMembers = activeMembers.slice(MAX_VISIBLE);

    return ( <div className="relative flex -space-x-2 items-center"  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}>
        {visibleMembers.map((m, i) => (
            <div
                key={m.employeeId || i}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-semibold border-2 border-base-100 shadow-sm"
            >
                {m.name?.[0] || "?"} </div>
        ))}

        {hiddenMembers.length > 0 && (
            <div

                className="w-8 h-8 flex items-center justify-center rounded-full bg-base-200 text-base-content text-xs font-semibold border-2 border-base-100 shadow-sm cursor-pointer"
            >
                +{hiddenMembers.length}
            </div>
        )}

        {hover && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-base-100 border rounded shadow-lg z-10 text-base-content">
                {activeMembers.map((m, i) => (
                    <div key={m.employeeId || i} className="text-sm py-0.5">
                        {m.name}
                    </div>
                ))}
            </div>
        )}

        {activeMembers.length === 0 && (
            <span className="text-xs opacity-70">멤버 없음</span>
        )}
    </div>

);
}
