import { Link, useLocation } from 'react-router-dom';

export default function BottomNavbar() {
    const location = useLocation();

    // Check if current path matches to set active state
    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/dashboard') ? 'text-primary' : 'text-slate-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link to="/create" className="flex flex-col items-center justify-center w-full h-full text-slate-400 group">
                    <div className={`p-2 rounded-full ${isActive('/create') ? 'bg-primary text-white' : 'bg-slate-800 text-primary group-hover:bg-slate-700'} transition-colors -mt-6 border-4 border-slate-900 shadow-lg`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-medium mt-1 ${isActive('/create') ? 'text-primary' : ''}`}>Add</span>
                </Link>

                <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/profile') ? 'text-primary' : 'text-slate-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
