import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../data/designAssets';
import { supabase } from '../../../data/supabaseClient';
import { useStudentProfile } from '../../features/student/hooks/useStudentProfile';
import { useSoundEffects } from '../../features/student/hooks/useSoundEffects'; // Import Sound Hook
import '../../features/student/styles/game-effects.css'; // Import Game CSS

export default function DesktopStudentLayout() {
    const { student } = useStudentProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const studentName = student?.display_name || student?.name || 'Student';
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Sound Effects
    const { playHover, playClick } = useSoundEffects();

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = async () => {
        playClick(); // SFX
        await supabase.auth.signOut();
        localStorage.removeItem('current_student');
        localStorage.removeItem('student_pin');
        navigate('/student/login');
    };

    const navItems = [
        { path: '/student/home', icon: 'home', label: 'Home' },
        { path: '/student/games', icon: 'sports_esports', label: 'Games' },
        { path: '/student/videos', icon: 'movie', label: 'Videos' },
        { path: '/student/rankings', icon: 'leaderboard', label: 'Ranking' },
    ];

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        playClick(); // SFX
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    }, [playClick]);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white flex flex-col flex-shrink-0 border-r border-slate-100 z-20 shadow-sm relative">
                {/* Brand */}
                <div className="p-6 flex items-center gap-3 hover-pop cursor-default" onMouseEnter={playHover}>
                    <div className="size-10 rounded-xl bg-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-400/30 animate-neon-pulse">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <span className="text-xl font-black bg-gradient-to-r from-teal-500 to-pink-500 bg-clip-text text-transparent text-gradient-flow">
                        English Fun
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={playClick}
                                onMouseEnter={playHover}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group hover-pop-sm ${active
                                        ? 'bg-cyan-50 text-cyan-600 font-bold shadow-sm ring-1 ring-cyan-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${active ? 'text-cyan-500 fill-current animate-bounce' : 'text-slate-400 group-hover:text-slate-500'
                                    }`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                                {active && (
                                    <span className="ml-auto text-[10px] text-yellow-400 material-symbols-outlined animate-spin-slow">stars</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 space-y-4">
                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        onMouseEnter={playHover}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-bold text-sm hover-pop-sm"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span>Logout</span>
                    </button>

                    {/* Profile Card */}
                    <Link
                        to="/student/profile"
                        onClick={playClick}
                        onMouseEnter={playHover}
                        className="block p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group hover-pop"
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <div className="size-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm group-hover:rotate-12 transition-transform">
                                    <img src={IMAGES.mascotKoala} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                    LVL 5
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{studentName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-50 px-1.5 py-0.5 rounded">
                                        <span className="material-symbols-outlined text-[12px] filled">emoji_events</span>
                                        150
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded">
                                        <span className="material-symbols-outlined text-[12px] filled">stars</span>
                                        320
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="flex-shrink-0 h-20 px-8 flex items-center justify-between z-10">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            Hi {studentName.split(' ')[0]}!
                            <span className="animate-wave origin-bottom-right inline-block">👋</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">Ready for some fun learning today?</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="size-10 rounded-xl bg-white text-slate-400 hover:text-cyan-500 hover:shadow-md transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </button>
                        <button className="size-10 rounded-xl bg-white text-slate-400 hover:text-pink-500 hover:shadow-md transition-all flex items-center justify-center relative">
                            <span className="material-symbols-outlined text-xl">notifications</span>
                            <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className={`size-10 rounded-xl transition-all flex items-center justify-center ${isFullscreen ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-teal-500 text-white hover:shadow-md'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
