import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, UserCircle } from 'lucide-react';
import logoLight from '../../assets/logo-light.svg';
import apiProcessor from '../../api/apiProcessor';
import { useAppSelector } from '../../store/hooks';

const Layout = () => {
    const navigate = useNavigate();
    const { userData } = useAppSelector((state) => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await apiProcessor.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-border px-8 py-4 flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <img src={logoLight} alt="truuth logo" className="h-6" />
                </div>

                {/* User Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 pr-2 transition-colors focus:outline-none"
                    >
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-semibold text-dark-text leading-tight">{userData?.fullName} ({userData?.username})</span>
                            <span className="text-xs text-gray-text leading-tight">{userData?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50 overflow-hidden">
                                {userData?.profileImageUrl ? (
                                    <img src={userData.profileImageUrl} alt="User profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle size={24} className="text-gray-400" />
                                )}
                            </div>
                            <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                <p className="text-sm font-semibold text-dark-text">{userData?.fullName} ({userData?.username})</p>
                                <p className="text-xs text-gray-text">{userData?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
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
