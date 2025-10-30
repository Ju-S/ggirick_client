import React from "react";
import { useThemeMode } from "../../context/ThemeContext.jsx";
import { DAISYUI_THEMES } from "@/config/theme.js";
import { Check } from "lucide-react";

export default function ThemeDropdown() {
    const { theme, setTheme } = useThemeMode();

    // 각 테마별 대표 색상 (테마 미리보기용)
    const themeColors = {
        light: "#e0e0e0",
        dark: "#1f1f1f",
        cupcake: "#f5c0cb",
        bumblebee: "#fadb14",
        emerald: "#50c878",
        corporate: "#2b6cb0",
        synthwave: "#ff0080",
        retro: "#ff9966",
        cyberpunk: "#ff007f",
        valentine: "#ff85a2",
        halloween: "#ff7518",
        garden: "#6bbf59",
        forest: "#228b22",
        aqua: "#00bcd4",
        lofi: "#c0b090",
        pastel: "#ffd1dc",
        fantasy: "#cba6f7",
        wireframe: "#a0a0a0",
        black: "#000000",
        luxury: "#bfae7c",
        dracula: "#6272a4",
        cmyk: "#00ffff",
        autumn: "#d2691e",
        business: "#0f172a",
        acid: "#d9ff00",
        lemonade: "#fef08a",
        night: "#111827",
        coffee: "#6f4e37",
        winter: "#cbd5e1",
    };

    return (
        <div className="dropdown dropdown-end">
            <label
                tabIndex={0}
                className="btn btn-sm bg-base-200 border-none hover:bg-base-300 text-sm font-semibold"
            >
                {"테마 선택"}
            </label>

            <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-56 max-h-72 overflow-y-auto"
            >
                {DAISYUI_THEMES.map((t) => (
                    <li key={t}>
                        <button
                            onClick={() => setTheme(t)}
                            className={`flex items-center justify-between gap-2 w-full px-2 py-1.5 rounded-md transition-colors duration-150 ${
                                theme === t
                                    ? "bg-primary text-primary-content"
                                    : "hover:bg-base-200"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {/* 테마 컬러 미리보기 점 */}
                                <div
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: themeColors[t] || "#ccc" }}
                                />
                                <span className="capitalize">{t}</span>
                            </div>
                            {theme === t && <Check size={16} />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
