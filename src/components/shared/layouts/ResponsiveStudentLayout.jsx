import { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import DesktopStudentLayout from './DesktopStudentLayout';

const DESKTOP_BREAKPOINT = 1024;

export default function ResponsiveStudentLayout() {
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BREAKPOINT : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);
        // Initial check
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isDesktop ? <DesktopStudentLayout /> : <StudentLayout />;
}
