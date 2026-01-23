import { useState, useEffect, useCallback } from 'react';
import { studentRepository } from '../../student/data/studentRepository';
import { classRepository } from '../data/classRepository';
import { useDebounce } from '../../../shared/hooks/useDebounce';

/**
 * Hook to manage student list logic
 * @returns {Object} Student list state and handlers
 */
export function useStudentList() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debounce search query to prevent API spam
    const debouncedSearch = useDebounce(searchQuery, 500);

    const loadStudents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await studentRepository.getFiltered({
                search: debouncedSearch,
                classId: selectedClassId
            });

            if (result.success) {
                setStudents(result.data || []);
            } else {
                setError(result.error);
                // Can fallback to empty list or keep previous data depending on UX preference
                setStudents([]);
            }
        } catch (err) {
            console.error('Error loading students:', err);
            setError(err.message);
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedClassId]);

    const loadClasses = async () => {
        const result = await classRepository.getActiveClasses();
        if (result.success) {
            setClasses(result.data);
        }
    };

    useEffect(() => {
        loadClasses();
        loadStudents();
    }, [loadStudents]);

    const handleDelete = async (studentId) => {
        // Optimistic update or wait for server?
        // For safety, wait for server
        try {
            const result = await studentRepository.delete(studentId);
            if (result.success) {
                // Reload or locally remove
                setStudents(prev => prev.filter(s => s.id !== studentId));
                return true;
            } else {
                console.error('Delete failed:', result.error);
                return false;
            }
        } catch (err) {
            console.error('Delete error:', err);
            return false;
        }
    };

    const createStudent = async (data) => {
        try {
            const result = await studentRepository.create(data);
            if (result.success) {
                // Optimistic or reload
                loadStudents();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateStudent = async (id, data) => {
        try {
            const result = await studentRepository.update(id, data);
            if (result.success) {
                loadStudents();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        students,
        classes,
        searchQuery,
        setSearchQuery,
        selectedClassId,
        setSelectedClassId,
        isLoading,
        error,
        handleDelete,
        createStudent,
        updateStudent,
        refresh: loadStudents
    };
}
