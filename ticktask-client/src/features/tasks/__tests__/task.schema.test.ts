import { describe, it, expect } from 'vitest';
import {
    TaskSchema,
    CreateTaskSchema,
    UpdateTaskSchema,
    PrioritySchema,
    TaskStatusSchema,
} from '../types';

describe('Task Schemas', () => {
    describe('PrioritySchema', () => {
        it('accepts valid priorities', () => {
            expect(PrioritySchema.parse('LOW')).toBe('LOW');
            expect(PrioritySchema.parse('MEDIUM')).toBe('MEDIUM');
            expect(PrioritySchema.parse('HIGH')).toBe('HIGH');
        });

        it('rejects invalid priorities', () => {
            expect(() => PrioritySchema.parse('INVALID')).toThrow();
            expect(() => PrioritySchema.parse('')).toThrow();
        });
    });

    describe('TaskStatusSchema', () => {
        it('accepts valid statuses', () => {
            expect(TaskStatusSchema.parse('TODO')).toBe('TODO');
            expect(TaskStatusSchema.parse('IN_PROGRESS')).toBe('IN_PROGRESS');
            expect(TaskStatusSchema.parse('DONE')).toBe('DONE');
        });

        it('rejects invalid statuses', () => {
            expect(() => TaskStatusSchema.parse('PENDING')).toThrow();
            expect(() => TaskStatusSchema.parse('')).toThrow();
        });
    });

    describe('TaskSchema', () => {
        it('validates a complete task', () => {
            const validTask = {
                id: 1,
                title: 'Test Task',
                description: 'Description',
                status: 'TODO',
                priority: 'HIGH',
                dueDate: '2024-12-31',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
            };

            const result = TaskSchema.parse(validTask);
            expect(result).toEqual(validTask);
        });

        it('allows optional description', () => {
            const taskWithoutDesc = {
                id: 1,
                title: 'Test Task',
                status: 'TODO',
                priority: 'MEDIUM',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
            };

            const result = TaskSchema.parse(taskWithoutDesc);
            expect(result.description).toBeUndefined();
        });

        it('allows optional dueDate', () => {
            const taskWithoutDueDate = {
                id: 1,
                title: 'Test Task',
                status: 'TODO',
                priority: 'LOW',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
            };

            const result = TaskSchema.parse(taskWithoutDueDate);
            expect(result.dueDate).toBeUndefined();
        });
    });

    describe('CreateTaskSchema', () => {
        it('validates a valid create request', () => {
            const validCreate = {
                title: 'New Task',
                status: 'TODO',
                priority: 'MEDIUM',
            };

            const result = CreateTaskSchema.parse(validCreate);
            expect(result.title).toBe('New Task');
        });

        it('requires title', () => {
            const invalidCreate = {
                status: 'TODO',
                priority: 'MEDIUM',
            };

            expect(() => CreateTaskSchema.parse(invalidCreate)).toThrow();
        });

        it('validates title max length', () => {
            const longTitle = {
                title: 'a'.repeat(101),
                status: 'TODO',
                priority: 'MEDIUM',
            };

            expect(() => CreateTaskSchema.parse(longTitle)).toThrow();
        });

        it('requires status', () => {
            const noStatus = {
                title: 'Test',
                priority: 'MEDIUM',
            };

            expect(() => CreateTaskSchema.parse(noStatus)).toThrow();
        });

        it('requires priority', () => {
            const noPriority = {
                title: 'Test',
                status: 'TODO',
            };

            expect(() => CreateTaskSchema.parse(noPriority)).toThrow();
        });
    });

    describe('UpdateTaskSchema', () => {
        it('allows partial updates', () => {
            const partialUpdate = {
                title: 'Updated Title',
            };

            const result = UpdateTaskSchema.parse(partialUpdate);
            expect(result.title).toBe('Updated Title');
            expect(result.status).toBeUndefined();
        });

        it('allows empty updates', () => {
            const emptyUpdate = {};
            const result = UpdateTaskSchema.parse(emptyUpdate);
            expect(result).toEqual({});
        });

        it('validates fields when provided', () => {
            const invalidUpdate = {
                priority: 'INVALID',
            };

            expect(() => UpdateTaskSchema.parse(invalidUpdate)).toThrow();
        });
    });
});
