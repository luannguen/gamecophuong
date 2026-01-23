import React from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserRole, USER_ROLES } from '../../../hooks/useUserRole';
import './teacher.css'; // Import Vanilla CSS

const TeacherLayout = () => {
    const { role, profile, loading, logout } = useUserRole();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="teacher-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem', color: '#4b5563' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (role !== USER_ROLES.TEACHER && role !== USER_ROLES.ADMIN) {
        return <Navigate to="/admin/login" replace />;
    }

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/teacher/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/teacher/students', icon: 'groups', label: 'Students' },
        { path: '/teacher/parents', icon: 'family_restroom', label: 'Parents' }, // Added Parents
        { path: '/student/games', icon: 'sports_esports', label: 'Play Games' },
    ];

    return (
        <div className="teacher-layout">
            {/* Header */}
            <header className="teacher-header">
                <div className="teacher-container">
                    <div className="header-content">
                        {/* Logo */}
                        <div className="header-logo-section">
                            <div className="logo-icon">
                                <span>👩‍🏫</span>
                            </div>
                            <div className="header-title">
                                <h1>Teacher Portal</h1>
                                <p>English Fun with AI</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="teacher-nav">
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
                        </nav>

                        {/* User Menu */}
                        <div className="user-menu">
                            <div className="user-info">
                                <p style={{ fontWeight: 500, color: '#1f2937' }}>{profile?.full_name || 'Teacher'}</p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{profile?.classes?.length || 0} classes</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn-logout"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                <span className="hidden-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="mobile-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default TeacherLayout;
