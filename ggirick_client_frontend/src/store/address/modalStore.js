import { create } from "zustand";

export const useAddressStore = create((set) => ({
  contacts: [],
  openModal: false,
  selectedSubGroupId: null, // 추가
  setOpenModal: (open) => set({ openModal: open }),
  setSelectedSubGroupId: (id) => set({ selectedSubGroupId: id }),
  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),
  setContacts: (newContacts) => set({ contacts: newContacts }),
}));