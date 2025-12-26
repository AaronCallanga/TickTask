import { z } from "zod";

export const PrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const TaskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    status: TaskStatusSchema,
    priority: PrioritySchema,
    dueDate: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().optional(),
    status: TaskStatusSchema,
    priority: PrioritySchema,
    dueDate: z.string().optional(),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = CreateTaskSchema.partial();
export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>;
