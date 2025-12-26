import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, getTasks, updateTask } from "@/api/tasks";
import type { CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { toast } from "sonner";

export const TASK_KEYS = {
    all: ["tasks"] as const,
};

export function useTasks() {
    return useQuery({
        queryKey: TASK_KEYS.all,
        queryFn: getTasks,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskRequest) => createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
            toast.success("Task created successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create task");
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTaskRequest }) =>
            updateTask({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
            toast.success("Task updated successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update task");
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
            toast.success("Task deleted successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to delete task");
        },
    });
}
