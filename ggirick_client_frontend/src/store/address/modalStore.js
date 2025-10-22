import { create } from "zustand";

export const useAddressStore = create((set) => ({
  openModal: false,
  setOpenModal: (value) => set({ openModal: value }),

  selectedSubGroupId: null,
  setSelectedSubGroupId: (id) => set({ selectedSubGroupId: id }),

  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
  updateContact: (updated) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === updated.id ? updated : c)),
    })),

  //  수정 관련 상태 추가
  editMode: false,
  setEditMode: (value) => set({ editMode: value }),
  editingContact: null,
  setEditingContact: (contact) => set({ editingContact: contact }),
}));