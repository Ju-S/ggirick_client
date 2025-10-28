import {create} from "zustand";
import {itemAPI} from "@/api/board/boardAPI.js";
import {getDetailAPI} from "@/api/approval/approvalAPI.js";

const useApprovalStore = create((set) => ({
    approvalInfo: {},
    loading: false,
    fetchApprovalInfo: (id) => {
        set({loading: true});
        getDetailAPI(id).then(resp => {
            console.log(resp.data);
            set({approvalInfo: resp.data, loading: false});
        });
    }
}))

export default useApprovalStore;