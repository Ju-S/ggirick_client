import apiRoutes from "../common/apiRoutes.js";
import api from "../common/apiInterceptor.js";

const chatAPI = {
    fetchWorkspaces: async () => {
        const route = apiRoutes.chat.listWorkspaces();
        const response = await api({ url: route.url, method: route.method });
        return response.data;
    },

    fetchChannels: async (workspaceId) => {
        const route = apiRoutes.chat.listChannels(workspaceId);
        const response = await api({ url: route.url, method: route.method });
        return response.data;
    },

    fetchWorkspaceMembers: async (workspaceId) => {
        const route = apiRoutes.chat.listWorkspaceMembers(workspaceId);
        const response = await api({ url: route.url, method: route.method });
        return response.data;
    },

    fetchChannelParticipants: async (workspaceId, channelId) => {
        const route = apiRoutes.chat.listChannelParticipants(workspaceId, channelId);
        const response = await api({ url: route.url, method: route.method });
        return response.data;
    },

    fetchMessages: async (workspaceId, channelId) => {
        const route = apiRoutes.chat.list(workspaceId, channelId);
        return api({
            url: route.url,
            method: route.method,
        });
    },
    fetchOldMessages: async (workspaceId, channelId, oldestId) => {
        const route = apiRoutes.chat.oldlist(workspaceId, channelId, oldestId);
        return api({
            url:route.url,
            method: route.method,
        })
    }
};

export default chatAPI;
