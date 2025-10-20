import { Drawer } from "flowbite-react";

export default function CustomDrawer({ isOpen, onClose, title, children }) {

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      position="right" // 오른쪽에서 나옴
      className="!bg-base-200 !text-base-content shadow-lg w-full max-w-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
        <h2 className="font-semibold text-lg">{title || "Drawer"}</h2>
        <button
          className="btn btn-sm btn-ghost"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </Drawer>
  );
}
