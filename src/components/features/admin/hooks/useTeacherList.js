import { useState, useEffect, useCallback } from 'react';
import { teacherRepository } from '../data/teacherRepository';
import { useDebounce } from '../../../shared/hooks/useDebounce';

/**
 * Hook to manage teacher list logic
 * @returns {Object} Teacher list state and handlers
 */
export function useTeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debounce search query
    const debouncedSearch = useDebounce(searchQuery, 500);

    const loadTeachers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await teacherRepository.getFiltered({
                search: debouncedSearch
            });

            if (result.success) {
                setTeachers(result.data || []);
            } else {
                setError(result.error);
                setTeachers([]);
            }
        } catch (err) {
            console.error('Error loading teachers:', err);
            setError(err.message);
            setTeachers([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        loadTeachers();
    }, [loadTeachers]);

    const handleDelete = async (teacherId) => {
        try {
            const result = await teacherRepository.delete(teacherId);
            if (result.success) {
                setTeachers(prev => prev.filter(t => t.id !== teacherId));
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Delete error:', err);
            return false;
        }
    };

    const createTeacher = async (data) => {
        try {
            const result = await teacherRepository.create(data);
            if (result.success) {
                loadTeachers();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateTeacher = async (id, data) => {
        try {
            const result = await teacherRepository.update(id, data);
            if (result.success) {
                loadTeachers();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        teachers,
        searchQuery,
        setSearchQuery,
        isLoading,
        error,
        handleDelete,
        createTeacher,
        updateTeacher,
        refresh: loadTeachers
    };
}
