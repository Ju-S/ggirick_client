import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    host: true, // 또는 host: '0.0.0.0'
    port: 5173, // 기본 포트
    strictPort: true // 이미 사용 중이면 에러 발생
  }
});
