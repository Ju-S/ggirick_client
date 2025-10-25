import apiRoutes from "../common/apiRoutes.js";
import api from "../common/apiInterceptor.js";

const chatAPI = {

    createWorkspace: async (workspaceData) => {
        const route = apiRoutes.chat.createWorkspace();
      return api({
          url: route.url,
          method: route.method,
          data:workspaceData,
      })
    },

    createChannel: async (workspaceId, channelData) =>{
        const route = apiRoutes.chat.createChannel(workspaceId);
        return api({
            url: route.url,
            method: route.method,
            data:channelData,
        })
    },
    updateChannel: async (workspaceId, channelId, channelData) => {
        const route = apiRoutes.chat.updateChannel(workspaceId, channelId);
        return api({
            url:route.url,
            method: route.method,
            data: channelData
        })
    }
    ,
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
    },
    syncChannelMembers: async (workspaceId, channelId, memberList) => {
        const route = apiRoutes.chat.syncChannelMembers(workspaceId,channelId);
        return api({
            url:route.url,
            method:route.method,
            data:memberList
        })
    },
    syncWorkspaceMembers: async (workspaceId,memberList) => {
        const route = apiRoutes.chat.syncWorkspaceMembers(workspaceId);
        return api({
            url:route.url,
            method:route.method,
            data:memberList
        })
    },
    openOrCreateDMChannel : async (workspaceId, targetId) => {
        const route= apiRoutes.chat.directChannel(workspaceId);
        const response = await api({
            url: route.url,
            method: route.method,
            data: { targetId },
        });
        return response.data
    }

};

export default chatAPI;
