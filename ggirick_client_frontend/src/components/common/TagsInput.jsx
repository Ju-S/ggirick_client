// components/TagsInput.jsx
import { useState } from "react";

export default function TagsInput({ value = [], onChange, placeholder = "태그 입력 후 Enter" }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, value.length - 1));
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center border border-base-300 rounded-lg p-2 bg-base-100">
      {value.map((tag, idx) => (
        <span key={idx} className="badge badge-primary gap-1">
          {tag}
          <button
            type="button"
            className="ml-1 text-white hover:text-red-200"
            onClick={() => removeTag(idx)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        className="flex-1 input input-ghost min-w-[100px] border-none focus:ring-0 focus:outline-none"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
