import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { CheckSquare, LayoutDashboard, Settings } from 'lucide-react'
import { Toaster } from "@/components/ui/sonner"
import { TaskDialog } from "@/components/tasks/TaskDialog"
import { useLocation } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const location = useLocation()

    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-white dark:bg-slate-900 sm:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <CheckSquare className="h-5 w-5" />
                        </div>
                        <span className="text-slate-900 dark:text-slate-50">TickTask</span>
                    </Link>
                </div>
                <nav className="flex flex-1 flex-col gap-1 p-4">
                    <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Tasks" active={location.pathname === '/'} />
                    <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" active={location.pathname === '/settings'} />
                </nav>
            </aside>

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

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 ${active ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50' : ''}`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
