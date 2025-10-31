import { create } from "zustand";
import api from "@/api/common/apiInterceptor.js";
import {createLocalTracks, createLocalVideoTrack, Room, RoomEvent} from "livekit-client";
import {OPENVIDU_LIVEKIT_URL} from "@/api/common/ipaddress.js";
import normalizeMessage from "@/utils/chat/nomalizeMessage.js";
import {navigate} from "react-big-calendar/lib/utils/constants.js";
import {useNavigate} from "react-router";

export const useLivekitStore = create((set, get) => ({
    room: null,              // LiveKit Room 객체
    token: null,             // JWT 토큰
    localVideoTrack: null,   // 내 카메라 트랙
    localAudioTrack:null,
    remoteTracks: [],        // RemoteTrackInfo 배열 [{ trackPublication, participantIdentity }]
    screenTrack: null,
    micEnabled: true,
    cameraEnabled: true,
    screenSharing: false,
    messages: [],

    myHandRaised: false,                  // 나만의 손 상태
    raisedParticipants: {},               // 다른 참가자 포함 모든 참가자 상태
    handAnimations: [], // [{ id: string, participantId: string }]

    addHandAnimation: (animation) => {
        const id = crypto.randomUUID();
        set(state => ({
            handAnimations: [...state.handAnimations, { id, ...animation }]
        }));
        setTimeout(() => {
            set(state => ({
                handAnimations: state.handAnimations.filter(anim => anim.id !== id)
            }));
        }, 2000);
    },
    setScreenTrack: (screen) => set({screenTrack:screen}),
    setMyHandRaised: ((hand) => set({ myHandRaised:hand})),
    setScreenSharing: (sharing)=>set({screenSharing:sharing}),
    setRoom: (room) => set({ room }),
    setToken: (token) => set({ token }),
    setLocalAudioTrack: (track) => set({localAudioTrack: track}),
    setLocalVideoTrack: (track) => set({ localVideoTrack: track }),
    setCameraEnabled: (isCameraOn) => set({cameraEnabled: isCameraOn}),
    addRemoteTrack: (trackInfo) => set((state) => ({
        remoteTracks: [...state.remoteTracks, trackInfo]
    })),
    removeRemoteTrack: (trackSid) => set((state) => ({
        remoteTracks: state.remoteTracks.filter((t) => t.trackPublication.trackSid !== trackSid)
    })),
    clearRoom: () => set({ room: null, token: null, localVideoTrack: null, remoteTracks: [] }),

    joinRoom: async function(roomName) {
        const { setRoom, setToken, setLocalVideoTrack, addRemoteTrack,removeRemoteTrack ,setLocalAudioTrack} = get();

        try {
            // 1️⃣ 서버에서 JWT 토큰 발급
            const res = await api.post('/openvidu/token', { roomName });
            const data = res.data;
            console.log("openvidu3 = 토큰 데이터:" + data)

            if (!data.token) throw new Error(data.errorMessage || 'Failed to get token');

            const token = data.token;
            setToken(token);

            //  LiveKit Room 객체 생성
            const room = new Room({ adaptiveStream: true, dynacast: true });

            //  서버에서 받은 JWT 토큰으로 접속
            const LIVEKIT_URL = OPENVIDU_LIVEKIT_URL;
            await room.connect(LIVEKIT_URL, token);
            console.log('✅ Connected to LiveKit room', roomName);

            //  이벤트 핸들러 등록
            room.on(RoomEvent.ParticipantConnected, (participant) => {
                console.log('Participant connected:', participant.identity);
            });

            room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                console.log('Track subscribed:', participant.identity, track.kind);
                addRemoteTrack({ trackPublication: publication, participantIdentity: participant.identity });
            });

            room.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
                removeRemoteTrack(publication.trackSid);
            });

            room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
                const message = JSON.parse(new TextDecoder().decode(payload));
                 console.log(`💬 ${participant.identity}`);
              console.log(message)

                if (message.type === "raiseHand") {

                    if(message.raised){
                        get().updateRaisedParticipant(participant.identity, true);
                        // 보내진 애니메이션 정보 사용
                        get().addHandAnimation(message.animation);
                    }else{
                        get().updateRaisedParticipant(participant.identity, false);
                    }

                }else if(message.type === "user"){
                    set((state) => ({ messages: [...state.messages, normalizeMessage(message)] }));
                }


            });


            // 장치 확인
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasCamera = devices.some(d => d.kind === "videoinput");
            const hasMic = devices.some(d => d.kind === "audioinput");
            console.log(`🎥 카메라: ${hasCamera}, 🎤 마이크: ${hasMic}`);

            // 🔹 로컬 트랙 생성 (중복 방지)
            const localTracks = await createLocalTracks({
                audio: hasMic,
                video: hasCamera
                    ? {
                        resolution: '1080p', // 720p는 'hd', 1080p는 'fullhd'
                        frameRate: 30,
                        facingMode: 'user',
                        simulcast: true
                    }
                    : false,
            });

            for(const track of localTracks) {
                await room.localParticipant.publishTrack(track);
                if(track.kind === "video") setLocalVideoTrack(track);
                else if(track.kind === "audio") setLocalAudioTrack(track);
            }

            // 기존 remoteParticipants 트랙 추가
            room.remoteParticipants.forEach(participant => {
                participant.videoTrackPublications.forEach(pub => {
                    if(pub.track) addRemoteTrack({ trackPublication: pub, participantIdentity: participant.identity });
                });
                participant.audioTrackPublications.forEach(pub => {
                    if(pub.track) addRemoteTrack({ trackPublication: pub, participantIdentity: participant.identity });
                });
            });

            //  store에 Room 저장
            setRoom(room);

            return room;
        } catch (err) {
            console.error('❌ Failed to join room:', err);
            get().clearRoom();
        }
    },

    leaveRoom: async function() {


        const { room, localVideoTrack, clearRoom } = get();

        if (room && localVideoTrack) {
            // 로컬 비디오 트랙 stop
            if (localVideoTrack) {
                localVideoTrack.stop(); // 카메라 장치 해제
                localVideoTrack.mediaStreamTrack.stop();
            }


            //  Room disconnect
            await room.disconnect();
        }
        clearRoom();


    },
    toggleMic: function() {
        const { room, micEnabled, setMicEnabled } = get();
        if (!room) return;

        // 안전하게 Map에서 첫 번째 트랙 가져오기
        const audioTrackPublication = Array.from(room.localParticipant.audioTracks.values())[0];
        const localAudio = audioTrackPublication?.track;

        if (!localAudio) {
            console.warn("⚠️ 토글할 로컬 오디오 트랙이 없습니다.");
            return;
        }

        if (micEnabled) {
            // 음소거
            localAudio.disable();
        } else {
            // 음 켜기
            localAudio.enable();
        }

        setMicEnabled(!micEnabled);
    },


    toggleCamera: async function () {
        const {room, localVideoTrack, setCameraEnabled,cameraEnabled,setLocalVideoTrack} = get();
        if (!room || !localVideoTrack) return;
        if (cameraEnabled) {
            console.log("카메라 끄기")
            await room.localParticipant.unpublishTrack(localVideoTrack);
            localVideoTrack.stop();
        }
        else{
            console.log("카메라 켜기")
            const newTrack = await createLocalVideoTrack({ facingMode: 'user' });
            await room.localParticipant.publishTrack(newTrack);
            setLocalVideoTrack(newTrack);
        }
        setCameraEnabled(!cameraEnabled);

    },

    toggleScreenShare: async function () {
        const { room, localVideoTrack, screenTrack, setLocalVideoTrack, setScreenTrack, screenSharing, setScreenSharing } = get();
        if (!room) return;

        try {
            if (!screenSharing) {
                // 화면 공유 시작
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenVideoTrack = stream.getTracks()[0];
                await room.localParticipant.publishTrack(screenVideoTrack, { name: "screen" });

                // 기존 카메라는 유지할 수도 있고, 필요하면 unpublish
                if (localVideoTrack) await room.localParticipant.unpublishTrack(localVideoTrack);

                setScreenTrack(screenVideoTrack);
                setScreenSharing(true);
            } else {
                // 화면 공유 종료
                const { screenTrack } = get();
                if (screenTrack) await room.localParticipant.unpublishTrack(screenTrack);

                const newTrack = await createLocalVideoTrack({ facingMode: 'user' });
                await room.localParticipant.publishTrack(newTrack);
                setLocalVideoTrack(newTrack);

                setScreenTrack(null);
                setScreenSharing(false);
            }
        } catch (err) {
            console.error("⚠️ 화면공유 토글 실패:", err);
        }
    },

    toggleHandUp: async () => {
        const { room, myHandRaised, setMyHandRaised, addHandAnimation } = get();
        const newState = !myHandRaised;
        setMyHandRaised(newState);

        if(!room) return;

        const emojis = ["✋", "🙋‍♂️","👋","🖖", "🖐️","🤘","🖕"];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const x = Math.random() * 80 - 40; // -20 ~ +20%
        const y = Math.random() * 20 - 10; // -10 ~ +10%
        const rotate = Math.random() * 40 - 20; // -20 ~ +20도


        const payload = {
            type: "raiseHand",
            raised: newState,
            animation: { emoji, x, y, rotate } // 애니메이션 정보 포함
        };

        const data = new TextEncoder().encode(JSON.stringify(payload));
        await room.localParticipant.publishData(data, { reliable: true });

        if (newState) {
            // 내 화면에도 즉시 애니메이션
            addHandAnimation(payload.animation);
        }
    },


    updateRaisedParticipant: (participantId, raised) => {
        set((state) => ({
            raisedParticipants: { ...state.raisedParticipants, [participantId]: raised }
        }));
    },

    sendMessage: ({files, type, content, parentId, emoji, senderId, senderName, viewer }) => {
       const {room,message } = get();

        const payload = {

            senderId,
            senderName,
            type,
            parentId,
            emoji,
            viewer,
            files,
            content: JSON.stringify(content),
            createdAt: new Date()
        };  console.log("발행한 페이로드:", payload);



        const data = new TextEncoder().encode(JSON.stringify(payload));
        room.localParticipant.publishData(data);

        set((state) => ({ messages: [...state.messages, normalizeMessage(payload)] }));
    },


}));
