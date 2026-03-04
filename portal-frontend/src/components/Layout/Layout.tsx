import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-border px-8 py-4 flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    {/* Mock Logo matching "truuth" in the screenshot */}
                    <div className="text-2xl font-bold tracking-tighter text-dark-text flex items-center">
                        tr<span className="text-brand">uu</span>th
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-dark-text leading-tight">Katherine Alison</span>
                        <span className="text-xs text-gray-text leading-tight">Echo Lima</span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <img
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="User profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-4xl py-10 px-4 flex flex-col flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
