import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../data/designAssets';
import { supabase } from '../../../data/supabaseClient';
import './Layouts.css';

import { useStudentProfile } from '../../features/student/hooks/useStudentProfile';

export default function DesktopStudentLayout() {
    const { student } = useStudentProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const studentName = student?.display_name || student?.name || 'Student';
    const [isFullscreen, setIsFullscreen] = useState(false);

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = async () => {
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

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    }, []);

    return (
        <div className={`desktop-student-layout ${isFullscreen ? 'is-fullscreen' : ''}`}>
            {/* Sidebar Navigation */}
            <aside className="desktop-sidebar">
                {/* Logo / Brand */}
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <span className="brand-text">English Fun</span>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout Button in Sidebar */}
                <button
                    onClick={handleLogout}
                    className="sidebar-logout-btn"
                    style={{
                        marginTop: 'auto',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        width: 'calc(100% - 24px)',
                        marginLeft: '12px',
                        marginRight: '12px',
                        border: 'none',
                        borderRadius: '12px',
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </button>

                {/* User Profile Section - Enhanced */}
                <Link to="/student/profile" className="sidebar-profile">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            <div
                                className="avatar-image"
                                style={{ backgroundImage: `url(${IMAGES.mascotKoala})` }}
                            ></div>
                        </div>
                        <div className="avatar-level-badge">
                            <span>5</span>
                        </div>
                    </div>
                    <div className="profile-info">
                        <p className="profile-name">{studentName}</p>
                        <div className="profile-stats">
                            <span className="stat-item">
                                <span className="material-symbols-outlined">emoji_events</span>
                                <span>150</span>
                            </span>
                            <span className="stat-item">
                                <span className="material-symbols-outlined">stars</span>
                                <span>320</span>
                            </span>
                        </div>
                    </div>
                    <div className="profile-achievements-btn">
                        <span className="material-symbols-outlined">military_tech</span>
                    </div>
                </Link>
            </aside>

            {/* Main Content Area */}
            <div className="desktop-main-wrapper">
                {/* Top Header */}
                <header className="desktop-header">
                    <div className="header-greeting">
                        <h1 className="header-title">Hi {studentName.split(' ')[0]}! 👋</h1>
                        <p className="header-subtitle">Ready for some fun learning today?</p>
                    </div>
                    <div className="header-actions">
                        <button className="header-icon-btn">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="header-icon-btn">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="notification-badge">3</span>
                        </button>
                        <button
                            className="header-icon-btn fullscreen-btn"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            <span className="material-symbols-outlined">
                                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="desktop-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
