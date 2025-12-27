import { format } from "date-fns";
import { MoreVertical, Calendar as CalendarIcon, Edit, Trash } from "lucide-react";

import type { Task } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
                return "bg-green-500 hover:bg-green-600";
            case "IN_PROGRESS":
                return "bg-blue-500 hover:bg-blue-600";
            default:
                return "bg-slate-500 hover:bg-slate-600";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "text-red-500 bg-red-50 dark:bg-red-950/20";
            case "MEDIUM":
                return "text-orange-500 bg-orange-50 dark:bg-orange-950/20";
            default:
                return "text-blue-500 bg-blue-50 dark:bg-blue-950/20";
        }
    };

    return (
        <Card className="flex flex-col h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between p-4 pb-2 space-y-0">
                <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                    </Badge>
                    <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
                        {task.title}
                    </CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                            onClick={() => onDelete(task.id)}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-2 flex flex-col gap-3">
                {task.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                        {task.description}
                    </p>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between text-xs">
                    <Badge variant="outline" className={`border-0 ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </Badge>
                    {task.dueDate && (
                        <div className="flex items-center text-slate-500">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
