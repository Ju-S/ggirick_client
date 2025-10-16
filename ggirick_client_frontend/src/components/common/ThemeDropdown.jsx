import React from "react";
import { useThemeMode } from "../../context/ThemeContext.jsx";
import { DAISYUI_THEMES } from "../../config/theme.js"

export default function ThemeDropdown() {
  const { theme, setTheme } = useThemeMode();

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn m-1">
        테마 선택
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52  max-h-60 overflow-y-auto"
      >
        {DAISYUI_THEMES.map((t) => (
          <li key={t}>
            <a onClick={() => setTheme(t)}>{t}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
