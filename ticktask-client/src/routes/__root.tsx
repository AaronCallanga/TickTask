import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from "@/components/ui/sonner"
import { TaskDialog } from "@/features/tasks"
import { Sidebar } from "@/layouts"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <main className="flex flex-1 flex-col sm:pl-64">
                <div className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </div>
            </main>
            <Toaster />
            <TaskDialog />
            <TanStackRouterDevtools />
        </div>
    )
}
