import {create} from "zustand";
import {itemAPI} from "@/api/board/boardAPI.js";

const useBoardStore = create((set) => ({
    boardInfo: {},
    loading: false,
    fetchBoardInfo: (id) => {
        set({loading: true});
        itemAPI(id).then(resp => {
            console.log(resp.data);
            set({boardInfo: resp.data, loading: false});
        });
    }
}))

export default useBoardStore;