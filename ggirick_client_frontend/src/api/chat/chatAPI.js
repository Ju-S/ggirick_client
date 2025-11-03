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
    },
    deleteWorkspace: async (workspaceId) => {
        const route = {
            url: `/workspace/${workspaceId}`,
            method: "DELETE",
        };
        return api({ url: route.url, method: route.method });
    },
    // 채널 삭제
    deleteChannel: async (workspaceId, channelId) => {
        const route = {
            url: `/workspace/${workspaceId}/channels/${channelId}`,
            method: "DELETE",
        };
        return api({ url: route.url, method: route.method });
    },


    getWorkspaceRole: async (workspaceId) =>{
        const route = {
            url: `/workspace/${workspaceId}/myrole`,
            method:'GET'
        }
        const response =  await api({ url: route.url, method: route.method });
       return response.data;
    },
    //채널 업데이트
    updateChannel: async (workspaceId, channelId, channelData) => {
        const route = apiRoutes.chat.updateChannel(workspaceId, channelId);
        return api({
            url:route.url,
            method: route.method,
            data: channelData
        })
    }
    ,
    //워크스페이스 업데이트
    updateWorkspace:  async (workspaceId, workspaceData) => {
        const route = apiRoutes.chat.updateWorkspace(workspaceId);
        return api({
            url:route.url,
            method: route.method,
            data:  workspaceData
        })
    },
    listFiles : async (workspaceId, channelId) => {
        const route = {
            url: `/workspace/${workspaceId}/channels/${channelId}/files`,
            method:'GET'
        }
        const response =  await api({ url: route.url, method: route.method });
        return response.data;

    },
    deleteFile: async (fileId) =>{

        const route =apiRoutes.chat.deleteFile();
        console.log(route.url)
        const response = await api.request({
            url: route.url,
            method: route.method,
            params: {fileId: fileId}
        });
        return response.data;
    },
    isMyChannel: async (workspaceId, channelId) => {
        const route = apiRoutes.chat.isMyChannel(workspaceId,channelId);

        return await api.request({
            url: route.url,
            method: route.method
        });
    }
};

export default chatAPI;
