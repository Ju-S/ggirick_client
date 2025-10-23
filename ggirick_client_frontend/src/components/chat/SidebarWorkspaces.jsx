import React from "react";

export default function SidebarWorkspaces() {
  return (
    <aside className="w-0 md:w-20 bg-base-200 flex flex-col items-center py-4 text-base-content shadow-md">
      {/* 워크스페이스 로고 */}
      <div className="font-bold text-lg mb-6">WS</div>

      {/* 아바타/채널 아이콘 */}
      <div className="flex flex-col space-y-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-content hover:bg-primary-focus cursor-pointer">
          A
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-secondary-content hover:bg-secondary-focus cursor-pointer">
          B
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent text-accent-content hover:bg-accent-focus cursor-pointer">
          +
        </div>
      </div>
    </aside>

  );
}
