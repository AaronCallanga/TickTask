import { createFileRoute } from '@tanstack/react-router'
import { Plus, LayoutList, Filter } from 'lucide-react'
import { useState } from 'react'

import { useTasks, useDeleteTask, useTaskStore, TaskCard, type Task } from '@/features/tasks'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/')({
    component: Dashboard,
})

function Dashboard() {
    const { data: tasks, isLoading, isError } = useTasks()
    const deleteTask = useDeleteTask()
    const { openCreateModal, openEditModal } = useTaskStore()
    const [filterStatus, setFilterStatus] = useState<string[]>(['TODO', 'IN_PROGRESS', 'DONE'])
    const [search, setSearch] = useState('')

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <Button disabled>
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-48 rounded-xl border bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <LayoutList className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Error loading tasks</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Could not connect to the server. Please ensure the backend is running.
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    const filteredTasks = tasks?.filter((task) => {
        const matchesStatus = filterStatus.includes(task.status);
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask.mutate(id);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">Manage and track your tasks.</p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search tasks..."
                        className="max-w-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={filterStatus.includes('TODO')}
                            onCheckedChange={(checked) =>
                                setFilterStatus(prev => checked ? [...prev, 'TODO'] : prev.filter(s => s !== 'TODO'))
                            }
                        >
                            To Do
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={filterStatus.includes('IN_PROGRESS')}
                            onCheckedChange={(checked) =>
                                setFilterStatus(prev => checked ? [...prev, 'IN_PROGRESS'] : prev.filter(s => s !== 'IN_PROGRESS'))
                            }
                        >
                            In Progress
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={filterStatus.includes('DONE')}
                            onCheckedChange={(checked) =>
                                setFilterStatus(prev => checked ? [...prev, 'DONE'] : prev.filter(s => s !== 'DONE'))
                            }
                        >
                            Done
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {filteredTasks && filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTasks.map((task: Task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <LayoutList className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        {search || filterStatus.length < 3
                            ? "Try adjusting your filters or search terms."
                            : "You haven't created any tasks yet."}
                    </p>
                    {(search || filterStatus.length < 3) ? (
                        <Button variant="outline" onClick={() => { setSearch(''); setFilterStatus(['TODO', 'IN_PROGRESS', 'DONE']); }}>
                            Clear Filters
                        </Button>
                    ) : (
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> Create your first task
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
