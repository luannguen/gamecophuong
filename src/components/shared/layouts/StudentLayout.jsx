import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../data/designAssets';
import { supabase } from '../../../data/supabaseClient';
import './Layouts.css';

import { useStudentProfile } from '../../features/student/hooks/useStudentProfile';

export default function StudentLayout() {
    const { student } = useStudentProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const studentName = student?.display_name?.split(' ')[0] || student?.name?.split(' ')[0] || 'Student';

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('current_student');
        localStorage.removeItem('student_pin');
        navigate('/student/login');
    };

    return (
        <div className="student-layout">
            {/* Background Gradient Effect */}
            <div className="bg-gradient-effect"></div>

            {/* Top App Bar */}
            <header className="top-bar">
                <div className="user-info">
                    <div className="avatar-ring" onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }}>
                        <div
                            className="avatar-image"
                            style={{ backgroundImage: `url(${IMAGES.mascotKoala})` }}
                        ></div>
                    </div>
                    <div className="greeting">
                        <p className="greeting-subtitle">Hi {studentName}!</p>
                        <h2 className="greeting-title">Ready for Fun?</h2>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link to="/student/profile" className="icon-btn" title="Profile">
                        <span className="material-symbols-outlined">person</span>
                    </Link>
                    <button className="icon-btn" onClick={handleLogout} title="Logout" style={{ color: '#ff6b6b' }}>
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Bottom Navigation Bar (iOS Style) */}
            <nav className="bottom-nav">
                <Link to="/student/home" className={`nav-item ${isActive('/student/home') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">home</span>
                    <span>Home</span>
                </Link>
                <Link to="/student/games" className={`nav-item ${isActive('/student/games') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">sports_esports</span>
                    <span>Games</span>
                </Link>
                <div className="nav-fab-container">
                    <Link to="/student/games" className="nav-fab">
                        <span className="material-symbols-outlined">add</span>
                    </Link>
                </div>
                <Link to="/student/videos" className={`nav-item ${isActive('/student/videos') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">movie</span>
                    <span>Videos</span>
                </Link>
                <Link to="/student/rankings" className={`nav-item ${isActive('/student/rankings') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">leaderboard</span>
                    <span>Ranking</span>
                </Link>
            </nav>
        </div>
    );
}
