import {create} from "zustand";

export const useAddressStore = create((set)=>({
    openModal:false, // 모달이 열렸는지 닫혔는지 상태
    contacts:[], // 주소록 목록
    setOpenModal:(value) => set({openModal:value}), // 열리고 닫히는걸 제어함
    addContact:(contact) => set((state)=>({contacts:[...state.contacts,contact]})),
}));