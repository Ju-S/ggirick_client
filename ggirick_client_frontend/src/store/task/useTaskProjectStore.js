import {create} from "zustand"
import {addMemberAPI, projectCreateAPI, projectListAPI, removeMemberAPI} from "@/api/task/projectAPI.js";
import {
  deleteAPI,
  insertAPI,
  updateAPI,
  updateStatusAPI,
} from "@/api/task/taskAPI.js";

const useTaskProjectStore = create((set,get) =>( {
  projects: [],
  selectedProject: null,
  selectedProjectId:null,
  selectedTask:null,
  activeView:"kanban",
  drawerOpen:false,

  isLoading: false,
  error: null,
    isProjectModalOpen: false,
    addMemberModalOpen: false,

    setProjectModalOpen: (isOpen) => set({ isProjectModalOpen: isOpen }),
    setAddMemberModalOpen: (isOpen) =>set({addMemberModalOpen: isOpen}),

  setProjects: (updater) => {
    // updater가 함수면 이전 값 기반으로 업데이트
    if (typeof updater === "function") {
      set((state) => ({ projects: updater(state.projects) }));
    } else if (Array.isArray(updater)) {
      set({ projects: updater });
    }
  },


  setSelectedProjectId:(projectID) =>{
   set({ selectedProjectId: projectID });
  },
  setSelectedProject:(project) => {
    set({selectedProject: project});
},
  setActiveView:(selectedView) =>{
   set({activeView:selectedView});
  },
  setDrawerOpen:(isOpen)=>{
   set({drawerOpen:isOpen});
  },


  setLoading: (loading) => set({ isLoading: loading }),

  fetchProjects: async () => {
    get().setLoading(true);
    try {
      const response = await projectListAPI();
      set({ projects: Array.isArray(response.data) ? response.data : [] });
    } catch (err) {
      console.error("프로젝트 목록을 불러오지 못했습니다.", err);
      set({ error: "프로젝트 목록을 불러오지 못했습니다." });
    } finally {
      get().setLoading(false);
    }
  },
  createTask: async(task) => {
    get().setLoading(true);
    try{
      await insertAPI(task);
      await get().fetchProjects();

    }catch(error){
      console.log("업데이트에 실패했습니다.", err);
      set({ error: "task 상태 업데이트에 실패했습니다." });

    }finally {
      get().setLoading(false);
    }
  },
  updateTask: async (taskId, updatedTask) => {
    get().setLoading(true);
    try {
      // 서버 업데이트
      await updateAPI(taskId, updatedTask); // updateAPI는 기존 insertAPI, deleteAPI와 유사한 형태로 구현

      // 선택된 프로젝트 업데이트
        await get().fetchProjects();
    } catch (err) {
      console.error("업데이트 오류:", err);
      set({ error: "업무 업데이트에 실패했습니다." });
      return false;
    } finally {
      get().setLoading(false);
    }
  },

  updateTaskStatus:  async(taskId, status) => {
    get().setLoading(true);
    try{
      await updateStatusAPI(taskId,status);
    }catch(error){
      console.log("업데이트에 실패했습니다.", err);
      set({ error: "task 상태 업데이트에 실패했습니다." });

    }finally {
      get().setLoading(false);
    }

  },
  deleteTask: async (taskId) => {
    get().setLoading(true);
    try {
      const currentProject = get().selectedProject;

      if (!currentProject || !currentProject.tasks) {
        console.error("삭제 실패: selectedProject 혹은 tasks가 존재하지 않습니다.");
        return false;
      }

      await deleteAPI(taskId);

      const updatedTasks = currentProject.tasks.filter(
        (task) => task.id !== taskId
      );

      set({
        selectedProject: {
          ...currentProject,
          tasks: updatedTasks,
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "업무 삭제에 실패했습니다.";
      set({ error: errorMessage });
      console.error("삭제 오류:", err);
      return false;
    } finally {
      get().setLoading(false);
    }
  },

    createProject: async (newProject) => {
        get().setLoading(true);
        try {
            await projectCreateAPI(newProject);
            await get().fetchProjects();
            return true;
        } catch (err) {
            console.error("프로젝트 생성 실패:", err);
            set({ error: "프로젝트 생성에 실패했습니다." });
            return false;
        } finally {
            get().setLoading(false);
        }
    },
    addProjectMember: async (projectId, employeeId) => {
        get().setLoading(true);
        try {
            await addMemberAPI(projectId, employeeId); // 서버 API 호출
            await get().fetchProjects(); // 프로젝트 목록 갱신
            return true;
        } catch (err) {
            console.error("멤버 추가 실패", err);
            set({ error: "멤버 추가 실패" });
            return false;
        } finally {
            get().setLoading(false);
        }
    },

// 프로젝트에서 멤버 제거
    removeProjectMember: async (projectId, employeeId) => {
        get().setLoading(true);
        try {
            await removeMemberAPI(projectId, employeeId);
            await get().fetchProjects();
            return true;
        } catch (err) {
            console.error("멤버 제거 실패", err);
            set({ error: "멤버 제거 실패" });
            return false;
        } finally {
            get().setLoading(false);
        }
    },

}));

export default useTaskProjectStore;