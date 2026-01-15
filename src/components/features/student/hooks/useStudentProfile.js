import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentRepository } from '../data/studentRepository';

export function useStudentProfile() {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const stored = localStorage.getItem('current_student');
        if (stored) {
            setStudent(JSON.parse(stored));
        } else {
            navigate('/student/login');
        }
        setIsLoading(false);
    };

    const login = async (pinCode) => {
        setIsLoading(true);
        const result = await studentRepository.login(pinCode);

        if (result.success) {
            localStorage.setItem('current_student', JSON.stringify(result.data));
            localStorage.removeItem('is_guest');
            setStudent(result.data);
            navigate('/student/home');
        }

        setIsLoading(false);
        return result;
    };

    const quickLogin = async (name, className) => {
        setIsLoading(true);
        let studentToLogin = null;
        let isGuest = false;

        // Try to find existing student
        const result = await studentRepository.findByName(name);

        if (result.success && result.data && result.data.length > 0) {
            studentToLogin = result.data[0];
        } else {
            // Create guest
            studentToLogin = {
                display_name: name,
                student_class: className || null,
                total_score: 0,
                total_stars: 0,
                is_active: true
            };
            isGuest = true;
        }

        if (studentToLogin) {
            localStorage.setItem('current_student', JSON.stringify(studentToLogin));
            if (isGuest) {
                localStorage.setItem('is_guest', 'true');
            } else {
                localStorage.removeItem('is_guest');
            }
            setStudent(studentToLogin);
            navigate('/student/home');
            setIsLoading(false);
            return { success: true, data: studentToLogin };
        }

        setIsLoading(false);
        return { success: false, error: 'Login failed' };
    };

    const logout = () => {
        localStorage.removeItem('current_student');
        localStorage.removeItem('is_guest');
        setStudent(null);
        navigate('/student/login');
    };

    return {
        student,
        isLoading,
        login,
        quickLogin,
        logout
    };
}
