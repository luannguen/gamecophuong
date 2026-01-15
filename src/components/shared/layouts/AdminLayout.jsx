import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../data/designAssets';
import { useAdminAuth } from '../../features/admin/hooks/useAdminAuth';
import './Layouts.css';
import { useEffect } from 'react';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, isLoading, logout } = useAdminAuth();

    // Protect route
    useEffect(() => {
        if (!isLoading && !admin) {
            navigate('/admin/login');
        }
    }, [isLoading, admin, navigate]);

    const isActive = (path) => location.pathname.startsWith(path);

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>; // Could use a proper spinner component here
    }

    if (!admin) return null; // Or return nothing while redirecting

    return (
        <div className="admin-layout">
            {/* Top App Bar */}
            <header className="admin-header">
                <div className="header-left">
                    <div className="avatar-container">
                        <div
                            className="header-avatar"
                            style={{ backgroundImage: `url(${IMAGES.missPhuong})` }}
                        ></div>
                    </div>
                    <div className="header-info">
                        <h2>Dashboard</h2>
                        <p className="header-subtitle">Admin Panel</p>
                    </div>
                </div>
                <button className="notification-btn">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="notification-dot"></span>
                </button>
            </header>

            {/* Main Content Area */}
            <main className="admin-main">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="admin-nav">
                <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                </Link>
                <Link to="/admin/students" className={`nav-item ${isActive('/admin/students') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">group</span>
                    <span>Students</span>
                </Link>
                <Link to="/admin/games" className={`nav-item ${isActive('/admin/games') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">sports_esports</span>
                    <span>Games</span>
                </Link>
                <Link to="/admin/vocabulary" className={`nav-item ${isActive('/admin/vocabulary') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">menu_book</span>
                    <span>Vocab</span>
                </Link>
                <Link to="/admin/videos" className={`nav-item ${isActive('/admin/videos') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">smart_display</span>
                    <span>Videos</span>
                </Link>
                <Link to="/admin/settings" className="nav-item" onClick={(e) => { e.preventDefault(); logout(); }}>
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </Link>
            </nav>

            {/* Floating Action Button */}
            <button className="admin-fab">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
}
