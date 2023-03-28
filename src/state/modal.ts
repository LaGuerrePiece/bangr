import { create } from "zustand";

interface ModalState {
  modalOpen: boolean;
  setModalOpen: (open: boolen) => void;
}

const useModalStore = create<ModalState>()((set) => ({
    modalOpen: false,
    setModalOpen: (open) => set({ modalOpen: open }),
}));

export default useModalStore;
