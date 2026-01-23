import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import StudentLayout from './StudentLayout';
import DesktopStudentLayout from './DesktopStudentLayout';
import { useUserRole, USER_ROLES } from '../../../hooks/useUserRole';

const DESKTOP_BREAKPOINT = 1024;

export default function ResponsiveStudentLayout() {
    const { role, loading } = useUserRole();
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BREAKPOINT : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show loading while checking role
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect admin to admin dashboard
    if (role === USER_ROLES.ADMIN) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Redirect teacher to teacher dashboard
    if (role === USER_ROLES.TEACHER) {
        return <Navigate to="/teacher/dashboard" replace />;
    }

    // Redirect parent to parent dashboard
    if (role === USER_ROLES.PARENT) {
        return <Navigate to="/parent/dashboard" replace />;
    }

    // Student or guest can access student pages
    return isDesktop ? <DesktopStudentLayout /> : <StudentLayout />;
}
