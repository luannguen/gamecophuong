import React from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useUserRole, USER_ROLES } from '../../../hooks/useUserRole';

const ParentLayout = () => {
    const { role, profile, loading, logout } = useUserRole();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/parent/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (role !== USER_ROLES.PARENT && role !== USER_ROLES.ADMIN) {
        return <Navigate to="/parent/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">👨‍👩‍👧</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">Parent Portal</h1>
                                <p className="text-xs text-gray-500">English Fun with AI</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                to="/parent/dashboard"
                                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/parent/children"
                                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                            >
                                My Children
                            </Link>
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-800">{profile?.full_name || 'Parent'}</p>
                                <p className="text-xs text-gray-500">{profile?.children?.length || 0} children</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default ParentLayout;
