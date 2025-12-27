import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <main className="flex flex-1 flex-col sm:pl-64">
                <div className="flex-1 p-4 sm:p-8">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
}
