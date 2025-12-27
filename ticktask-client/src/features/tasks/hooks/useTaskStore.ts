import { create } from "zustand";
import type { Task } from "../types";

interface TaskStore {
    isTaskModalOpen: boolean;
    selectedTask: Task | null;
    openCreateModal: () => void;
    openEditModal: (task: Task) => void;
    closeTaskModal: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    isTaskModalOpen: false,
    selectedTask: null,
    openCreateModal: () => set({ isTaskModalOpen: true, selectedTask: null }),
    openEditModal: (task) => set({ isTaskModalOpen: true, selectedTask: task }),
    closeTaskModal: () => set({ isTaskModalOpen: false, selectedTask: null }),
}));
