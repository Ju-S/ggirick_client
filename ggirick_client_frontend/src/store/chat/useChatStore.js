import { create } from "zustand";
import chatAPI from "@/api/chat/chatAPI.js";

function normalizeMessage(m) {
    return {
        id: m.id,
        senderId: m.senderId,
        senderName: m.senderName || "Unknown",
        type: m.type,
        content: JSON.parse(m.content || "[]"),
        like: m.like_count || 0,
        likeUsers:m.likeUsers || [],
        viewer:m.viewer || [],
        reactions: m.reactions || [],
        time: new Date(m.createdAt).toLocaleTimeString([], {  year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit" }),
    };
}


const useChatStore = create((set, get) => ({
    workspaces: [],
    channels: [],
    workspaceId: null,
    channelId: null,
    selectedWorkspace: null,
    selectedChannel: null,
    selectedWorkspaceMember: [],
    selectedChannelMember: [],
    messages: [],
    workspaceRole: null,
    loading: false,
    hasMoreMessages: false,
    //채널 캐싱전략
    channelMessages: new Map(), // { channelId: ChatMessageFromDBDTO[] }


    setChannelMessages: (channelId, messages) =>
        set((state) => ({
            channelMessages: new Map(state.channelMessages).set(channelId, messages)
        })),

    getChannelMessages: (channelId) => get().channelMessages.get(channelId) || [],

    setWorkspaceRole: (role) => set({ workspaceRole: role }),
    setLoading: (isLoading) => set({loading: isLoading}),
    setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),
    setSelectedChannelMember: (members) => set({ selectedChannelMember: members }),
    setSelectedWorkspaceMember: (members) => set({selectedWorkspaceMember:members}),
    setSelectedChannel: (selectedChannel) => set({selectedChannel}),
    setSelectedWorkspace:(selectedWorkspace) => set({selectedWorkspace}),
    setChannels: (channels) => set({ channels }),
    removeChannel: (channelId) => set(state => ({
        channels: state.channels.filter(ch => ch.id !== channelId)
    })),
    removeWorkspace: (workspaceId) => set(state => ({

        workspaces: state.workspaces.filter(wk => wk.id !== workspaceId)
    })),
    updateSelectedChannel: (channelInfo) =>
        set((state) => ({
            selectedChannel: channelInfo,
            channels: state.channels.map((ch) =>
                ch.id === channelInfo.id ? { ...ch, ...channelInfo } : ch
            ),
        })),

    updateSelectedWorkspace: (workspaceInfo) =>
        set((state) => ({
            selectedWorkspace: workspaceInfo,
            workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceInfo.id ? {...workspace, ...workspaceInfo} : workspace),
        })),
// 워크스페이스 불러오기
    fetchWorkspaces: async () => {
        const {setLoading} = get();

        setLoading(true)
        const data = await chatAPI.fetchWorkspaces();
        set({ workspaces: data,});

        setLoading(false)

    },

    //해당하는 워크스페이스에서 내역할 불러오기

    fetchWorkspaceRole: async (workspaceId) => {

        const {setWorkspaceRole} = get();
        try {
            const role = await chatAPI.getWorkspaceRole(workspaceId);
            setWorkspaceRole(role);
        } catch (error) {
            console.error("워크스페이스 역할 불러오기 실패:", error);
            set({ workspaceRole: null });
        }
    },

    fetchChannels: async () => {
      const {setLoading, selectedWorkspace} = get();
      setLoading(true);
      const channels  = await chatAPI.fetchChannels( selectedWorkspace.id);
      set({channels })
        setLoading(false);
    },

    // 워크스페이스 선택
    selectWorkspace: async (workspace) => {
        const {fetchWorkspaceRole,workspaceRole} = get();
        set({ selectedWorkspace: workspace, selectedChannel: null, messages: [], channels: [], });

        try {
            const channels = await chatAPI.fetchChannels(workspace.id);
            set({ channels });
            // 워크스페이스 멤버 가져오기
            const members = await chatAPI.fetchWorkspaceMembers(workspace.id);
            set({ selectedWorkspaceMember: members });

            //워크스페이스에서의 내역할 세팅하기
            fetchWorkspaceRole(workspace.id);


        } catch (err) {
            console.error("채널 불러오기 실패:", err);
            set({ channels: [] });
        }
    },


    // 채널 설정 + 메시지 불러오기 + 채널 구독
    setChannel: async (channel) => {
        const {setLoading, getChannelMessages,selectedWorkspace,} = get();
        if(!selectedWorkspace) return;

        set({selectedChannel: channel,messages:[]})

        setLoading(true);
        //캐시된 메시지 있으면 서버 호출 없이 렌더링
        const cached = getChannelMessages(channel.id);
        if (cached.length > 0) {
            setTimeout(() => {
                set({ messages: cached });
                setLoading(false);
            }, 100); // 100ms 딜레이로 로딩 표시 보임
            return;
        }

        set({ hasMoreMessages: true, messages: [] });


        try {
            const res = await chatAPI.fetchMessages(selectedWorkspace.id, channel.id);
            const messages = (res.data || []).map(normalizeMessage);

            set({ selectedChannel:channel, messages});
            get().setChannelMessages(channel.id, messages);

            console.log(messages);
            const members = await chatAPI.fetchChannelParticipants(selectedWorkspace.id, channel.id);
            set({ selectedChannelMember: members });


        } catch (err) {
            console.error(err);

        } finally {
            setLoading(false);
        }
    },

    addMessage:  async(m) => {
        const { messages, selectedChannel,selectedChannelMember,channelMessages, setChannelMessages} = get();
        switch (m.type) {
            case "user":
                const newMsg = normalizeMessage(m);

                console.log("새 메시지 추가:", newMsg);

                set((state) => ({ messages: [...state.messages, newMsg] }));
                if (selectedChannel) {
                    const updated = [...(channelMessages.get(selectedChannel.id) || []), newMsg];
                    setChannelMessages(selectedChannel.id, updated);
                }
                break;
            case "system":
                try {
                    const content = typeof m.content === "string" ? JSON.parse(m.content) : m.content;
                    m.content = content; // 메시지 객체에 실제 content 넣기

                    set((state) => ({ messages: [...state.messages, m] }));

                    if (selectedChannel) {
                        const updated = [...(channelMessages.get(selectedChannel.id) || []), m];
                        setChannelMessages(selectedChannel.id, updated);
                    }

                    switch (content.event) {
                        case "CHANNEL_DELETED":
                            set((state) => ({
                                channels: state.channels.filter(ch => ch.id !== m.channelId),
                                selectedChannel: state.selectedChannel?.id === m.channelId ? null : state.selectedChannel
                            }));
                            break;

                        case "CHANNEL_MEMBERS_ADDED":
                            console.log("멤버 추가 알림:", content.addedMemberNames);
                            // 필요하면 상태 업데이트 가능
                            break;

                        case "CHANNEL_MEMBERS_REMOVED":
                            console.log("멤버 제거 알림:", content.removedMemberNames);
                            // 필요하면 상태 업데이트 가능
                            break;

                        default:
                            break;
                    }
                } catch (e) {
                    console.error("System message parse error", e);
                }
                break;

            case "like":
                console.log("👍 좋아요 이벤트 수신:", m);

                set((state) => {
                    const updatedMessages = state.messages.map((msg) => {
                        const targetId = m.parentId ?? m.messageId;
                        if (msg.id !== targetId) return msg;

                        const delta = m.liked ? 1 : -1;

                        // likeUsers 업데이트
                        let updatedLikeUsers = Array.isArray(msg.likeUsers) ? [...msg.likeUsers] : [];
                        if (m.liked) {
                            if (!updatedLikeUsers.includes(m.employeeId)) {
                                updatedLikeUsers.push(m.employeeId);
                            }
                        } else {
                            updatedLikeUsers = updatedLikeUsers.filter(id => id !== m.employeeId);
                        }

                        return {
                            ...msg,
                            like: (msg.like || 0) + delta,
                            likeUsers: updatedLikeUsers
                        };
                    });
                    return { messages: updatedMessages };
                });
                break;
            case "viewer":
                console.log("📖 읽음 반응 이벤트 수신:", m);

                set((state) => {
                    const updatedMessages = state.messages.map((msg) => {
                        const targetId = m.parentId ?? m.messageId;
                        if (msg.id !== targetId) return msg;

                        // 기존 viewer 배열 안전 복사
                        const updatedViewers = Array.isArray(msg.viewer) ? [...msg.viewer] : [];

                        // 읽음 여부 판별 (서버에서 liked처럼 true/false로 보내는지, 배열로 보내는지에 따라 조정)
                        const isAdd = m.viewer?.length ? true : m.viewed ?? true; // 안전하게 처리

                        if (isAdd) {
                            if (!updatedViewers.includes(m.employeeId)) {
                                updatedViewers.push(m.employeeId);
                            }
                        } else {
                            // 제거 (예: 읽음 취소)
                            const idx = updatedViewers.indexOf(m.employeeId);
                            if (idx !== -1) updatedViewers.splice(idx, 1);
                        }

                        return { ...msg, viewer: updatedViewers };
                    });

                    return { messages: updatedMessages };
                });
                break;

            case "emoji":
                console.log("😊 이모지 반응 이벤트 수신:", m);

                set((state) => ({
                    messages: state.messages.map((msg) => {
                        if (msg.id !== m.messageId) return msg;

                        const reactions = [...(msg.reactions || [])];
                        const idx = reactions.findIndex((r) => r.emoji === m.emoji);

                        if (idx > -1) {
                            // 기존 반응 → 토글
                            const r = reactions[idx];
                            const updatedUsers = m.reacted
                                ? [...(r.users || []), m.employeeId]
                                : (r.users || []).filter((u) => u !== m.employeeId);

                            if (updatedUsers.length === 0) {
                                reactions.splice(idx, 1);
                            } else {
                                reactions[idx] = { ...r, users: updatedUsers };
                            }
                        } else if (m.reacted) {
                            // 새 반응 추가
                            reactions.push({ emoji: m.emoji, users: [m.employeeId] });
                        }

                        return { ...msg, reactions };
                    }),
                }));
                break;
            default:
                console.warn("Unknown message type:", m.type);
        }

    },

    addReaction: (messageId, emoji) => {
        console.log("messageId"+messageId+"emoji"+emoji);
        set((state) => ({
            messages: state.messages.map((msg) => {
                if (msg.id !== messageId) return msg;

                const existing = msg.reactions?.find((r) => r.emoji === emoji);
                if (existing) {
                    return {
                        ...msg,
                        reactions: msg.reactions.map((r) =>
                            r.emoji === emoji
                                ? { ...r, users: [...new Set([...r.users, "You"])] }
                                : r
                        ),
                    };
                }

                // 새 이모지 추가
                return {
                    ...msg,
                    reactions: [...(msg.reactions || []), { emoji, users: ["You"] }],
                };
            }),
        }));
    },

    fetchOldMessages : async() => {
        const { messages, selectedWorkspace,  selectedChannel,hasMoreMessages, setHasMoreMessages,channelMessages,setChannelMessages} = get();

        setHasMoreMessages(messages.length >= 30);

        if(!hasMoreMessages) return;

        const oldestId = messages[0].id;
        try {
            const res = await chatAPI.fetchOldMessages(selectedWorkspace.id, selectedChannel.id, oldestId);
            const oldMessages = (res.data || []).map(normalizeMessage);
            if (oldMessages.length === 0) set({ hasMoreMessages: false });
            set((state) => ({ messages: [...oldMessages, ...state.messages] }));
            const updated = [...oldMessages, ...(channelMessages.get(selectedChannel.id) || [])];
            setChannelMessages(selectedChannel.id, updated);

        } catch (err) {
            console.error("이전 메시지 불러오기 실패:", err);
        }

    },
}));

export default useChatStore;
