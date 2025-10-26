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
        reactions: m.reactions || [],
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
        const {setLoading} = get();
        setLoading(true)
        set({ selectedChannel:channel });
        const {selectedWorkspace} = get();
        set({ hasMoreMessages: true, messages: [] });
        try {
            const res = await chatAPI.fetchMessages(selectedWorkspace.id, channel.id);
            const messages = res.data || [];

            // 메시지 구조 맞추기
            const normalized = messages.map((m) => {


                return {id: m.id,
                    senderId: m.senderId,
                    senderName: m.senderName || "Unknown",
                    type: m.type,
                    content: JSON.parse(m.content || "[]"),
                    like: m.like_count || 0,
                    likeUsers: m.likeUsers,
                    reactions: m.reactions,
                    time: new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
            });

            set({ messages: normalized, loading: false });
            console.log(messages);
            const members = await chatAPI.fetchChannelParticipants(selectedWorkspace.id, channel.id);
            set({ selectedChannelMember: members });

        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    },

    addMessage:  async(m) => {
        const { messages, selectedChannelMember} = get();
        switch (m.type) {
            case "user":
                const newMsg = normalizeMessage(m);

                console.log("📨 새 메시지 추가:", newMsg);

                set((state) => ({ messages: [...state.messages, newMsg] }));
                break;
            case "system":

                const systemMsg = {
                    id: m.id,
                    type: "system",
                    content: m.content,
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };
                set((state) => ({ messages: [...state.messages, systemMsg] }));

                switch(m.event) {
                    case "CHANNEL_DELETED":
                        set((state) => ({
                            channels: state.channels.filter(ch => ch.id !== m.channelId),
                            selectedChannel: state.selectedChannel?.id === m.channelId ? null : state.selectedChannel
                        }));
                        break;

                    case "CHANNEL_MEMBERS_UPDATED":
                        if (m.channelId === get().selectedChannel?.id) {
                            set({ selectedChannelMember: m.members });
                        }
                        break;

                    case "WORKSPACE_MEMBERS_UPDATED":
                        set({ selectedWorkspaceMember: m.members });
                        break;

                    default:
                        console.warn("Unknown system event:", m.event);
                }
                break;
            case "like":
                // 메시지에 좋아요 카운트 업데이트
                console.log("👍 좋아요 이벤트 수신:", m);

                // 메시지 리스트에서 해당 messageId 찾기
                set((state) => {
                    const updatedMessages = state.messages.map((msg) => {
                        // parentId, messageId 둘 다 지원
                        const targetId = m.parentId ?? m.messageId;
                        if (msg.id !== targetId) return msg;

                        const delta = m.liked ? 1  : -1; // 서버에서 liked/unliked 둘 다 오는 경우 대응
                        return { ...msg, like: (msg.like || 0) + delta };
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
        const { messages, selectedWorkspace,  selectedChannel,hasMoreMessages, setHasMoreMessages} = get();

        setHasMoreMessages(messages.length >= 30);

        if(!hasMoreMessages) return;

        const oldestId = messages[0].id;
        try {
            const res = await chatAPI.fetchOldMessages(selectedWorkspace.id, selectedChannel.id, oldestId);
            const oldMessages = (res.data || []).map(normalizeMessage);
            if (oldMessages.length === 0) set({ hasMoreMessages: false });
            set((state) => ({ messages: [...oldMessages, ...state.messages] }));
        } catch (err) {
            console.error("이전 메시지 불러오기 실패:", err);
        }

    },
}));

export default useChatStore;
