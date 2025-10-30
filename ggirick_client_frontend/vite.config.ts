import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import svgr from 'vite-plugin-svgr';
import path from 'path';
import * as fs from "node:fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact(), svgr()],
    server: {
        https: {
            key: fs.readFileSync('./../key.pem'),
            cert: fs.readFileSync('./../cert.pem'),
        },
      host: '0.0.0.0',
      allowedHosts: ["ggirick.site", "www.ggirick.site","dev.ggirick.site"],
        hmr: {
            host: 'dev.ggirick.local',
            port: 5173, // 클라이언트 포트
        },

    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        global: 'window', // global을 window로 매핑
    },
});
