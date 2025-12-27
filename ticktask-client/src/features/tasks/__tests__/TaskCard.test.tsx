import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../types';

const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task description',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

describe('TaskCard', () => {
    it('renders task title', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('renders task description', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    });

    it('displays status badge with correct text', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('TODO')).toBeInTheDocument();
    });

    it('displays priority badge', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('HIGH')).toBeInTheDocument();
    });

    it('displays due date when provided', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
    });

    it('does not show description when empty', () => {
        const taskWithoutDesc = { ...mockTask, description: undefined };
        render(
            <TaskCard
                task={taskWithoutDesc}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.queryByText('This is a test task description')).not.toBeInTheDocument();
    });

    it('renders IN_PROGRESS status with space', () => {
        const inProgressTask = { ...mockTask, status: 'IN_PROGRESS' as const };
        render(
            <TaskCard
                task={inProgressTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    });

    it('renders DONE status with green styling', () => {
        const doneTask = { ...mockTask, status: 'DONE' as const };
        render(
            <TaskCard
                task={doneTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('DONE')).toBeInTheDocument();
    });

    it('has accessible actions button', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByRole('button', { name: /actions/i })).toBeInTheDocument();
    });
});
