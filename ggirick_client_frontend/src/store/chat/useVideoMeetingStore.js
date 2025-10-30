import { create } from "zustand";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import api from "@/api/common/apiInterceptor.js";

export const useVideoMeetingStore = create((set, get) => ({
    OV: null,
    session: null,
    sessionId: null,
    token: null,
    setSession:((session) => ({session})),
    setSessionId: ((sessionId) => (sessionId)),
    initSession: async function () {
        const OV = new OpenVidu();

        // 1️⃣ 세션 생성 또는 확인
        let sessionId;
        try {
            const sessionRes = await api({ url: "/openvidu/sessions", method: "post" });
            sessionId = sessionRes.data.sessionId;
            console.log("생성된 세션 ID:", sessionId);
        } catch (err) {
            // 이미 존재하면 get 방식으로 확인
            const listRes = await api({ url: "/openvidu/sessions", method: "get" });
            if (listRes.data.content.length > 0) {
                sessionId = listRes.data.content[0].sessionId;
                console.log("기존 세션 사용:", sessionId);
            } else {
                throw new Error("세션 생성 및 조회 실패");
            }
        }


        const tokenRes = await api({
            url: `/openvidu/sessions/${sessionId}/token`,
            method: "post",
        });
        const token = tokenRes.data.token;
        console.log("발급된 토큰:", token);


        const session = OV.initSession();
        await session.connect(token);


        this.state = { OV, session, sessionId, token };

        return { session, token };
    },


    // 세션 연결 (join)
    joinSession: async () => {
        const { session, token, OV } = get();
        await session.connect(token);
        const publisher = OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
        });

        session.publish(publisher);
        set({ publisher });
    },

    // ✅ 시그널 전송
    sendMessage: (message) => {
        const { session } = get();
        if (session) {
            session.signal({
                type: "chat",
                data: message,
            });
        }
    },

    // ✅ 종료
    leaveSession: () => {
        const { session } = get();
        if (session) session.disconnect();
        set({
            OV: null,
            session: null,
            publisher: null,
            subscribers: [],
            token: null,
            sessionId: null,
            messages: [],
        });
    },
}));