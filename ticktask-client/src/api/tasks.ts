import { api } from "@/lib/axios";
import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types/task";

export const getTasks = async (): Promise<Task[]> => {
    const { data } = await api.get("/api/tasks");
    return data;
};

export const getTask = async (id: number): Promise<Task> => {
    const { data } = await api.get(`/api/tasks/${id}`);
    return data;
};

export const createTask = async (task: CreateTaskRequest): Promise<Task> => {
    const { data } = await api.post("/api/tasks", task);
    return data;
};

export const updateTask = async ({
    id,
    data: taskData,
}: {
    id: number;
    data: UpdateTaskRequest;
}): Promise<Task> => {
    const { data } = await api.put(`/api/tasks/${id}`, taskData);
    return data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
};
