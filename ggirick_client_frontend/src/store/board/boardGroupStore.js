import {create} from "zustand";
import {boardGroupListAPI} from "@/api/board/boardAPI.js";

const useBoardGroupStore = create((set) => ({
    list: [],
    loading: false,
    init: async () => {
        set({loading: true});
        const resp = await boardGroupListAPI();
        set({list: resp.data, loading: false});
    }
}))

export default useBoardGroupStore;