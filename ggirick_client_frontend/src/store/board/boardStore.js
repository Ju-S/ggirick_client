import {create} from "zustand";
import {itemAPI} from "@/api/board/boardAPI.js";

const useBoardStore = create((set) => ({
    approvalInfo: {},
    loading: false,
    fetchBoardInfo: (id) => {
        set({loading: true});
        itemAPI(id).then(resp => {
            console.log(resp.data);
            set({approvalInfo: resp.data, loading: false});
        });
    }
}))

export default useBoardStore;