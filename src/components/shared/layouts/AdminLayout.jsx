import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../data/designAssets';
import { useAdminAuth } from '../../features/admin/hooks/useAdminAuth';
import '../../features/admin/admin.css'; // Import Admin Vanilla CSS
import { useEffect } from 'react';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, isLoading, logout } = useAdminAuth();

    // Protect route code remains same...
    useEffect(() => {
        if (!isLoading && !admin) {
            navigate('/student/login');
        }
    }, [isLoading, admin, navigate]);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!admin) return null;

    const navItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/admin/students', icon: 'school', label: 'Students' },
        { path: '/admin/teachers', icon: 'person_apron', label: 'Teachers' }, // New Teacher Management
        { path: '/admin/classes', icon: 'class', label: 'Classes' },
    ];

    const contentItems = [
        { path: '/admin/games', icon: 'sports_esports', label: 'Game Library' },
        { path: '/admin/vocabulary', icon: 'menu_book', label: 'Vocabulary' },
    ];

    return (
        <div className="admin-layout">
            {/* Left Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span style={{ fontSize: '24px' }}>🛡️</span>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="nav-section-label">Management</div>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <Link
                        to="/admin/parents"
                        className={`nav-link ${isActive('/admin/parents') ? 'active' : ''}`}
                    >
                        <span className="material-symbols-outlined">family_restroom</span>
                        <span>Parents</span>
                    </Link>

                    <div className="nav-section-label" style={{ marginTop: '24px' }}>Content</div>
                    {contentItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <div className="user-profile-mini">
                        <div className="user-avatar">A</div>
                        <div className="user-info-mini">
                            <h4>Administrator</h4>
                            <p>Online</p>
                        </div>
                        <button className="game-logout-btn-icon" onClick={logout} title="Sign Out">
                            <span className="material-symbols-outlined">power_settings_new</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="admin-main-wrapper">
                {/* Header */}
                <header className="admin-header">
                    <div className="header-title">
                        <h2>
                            {location.pathname.includes('dashboard') ? 'Dashboard' :
                                location.pathname.split('/')[2]?.charAt(0).toUpperCase() + location.pathname.split('/')[2]?.slice(1) || 'Page'}
                        </h2>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="action-btn">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation (Visible on < 768px) */}
            <nav className="admin-bottom-nav">
                {navItems.slice(0, 4).map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
                <Link to="/admin/settings" className="mobile-nav-item" onClick={(e) => { e.preventDefault(); logout(); }}>
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </Link>
            </nav>
        </div>
    );
}
