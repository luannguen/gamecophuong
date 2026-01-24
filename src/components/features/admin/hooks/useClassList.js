import { useState, useEffect, useCallback } from 'react';
import { classRepository } from '../data/classRepository';
import { teacherRepository } from '../data/teacherRepository'; // To load teachers for dropdown
import { useDebounce } from '../../../shared/hooks/useDebounce';

/**
 * Hook to manage class list logic
 * @returns {Object} Class list state and handlers
 */
export function useClassList() {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debounce search query
    const debouncedSearch = useDebounce(searchQuery, 500);

    const loadClasses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await classRepository.getFiltered({
                search: debouncedSearch
            });

            if (result.success) {
                setClasses(result.data || []);
            } else {
                setError(result.error);
                setClasses([]);
            }
        } catch (err) {
            console.error('Error loading classes:', err);
            setError(err.message);
            setClasses([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    // Load available teachers for the form dropdown
    const loadTeachers = async () => {
        try {
            const result = await teacherRepository.getFiltered();
            if (result.success) {
                setTeachers(result.data || []);
            }
        } catch (err) {
            console.error("Failed to load teachers for class form:", err);
        }
    };

    useEffect(() => {
        loadClasses();
        loadTeachers();
    }, [loadClasses]);

    const handleDelete = async (classId) => {
        try {
            const result = await classRepository.delete(classId);
            if (result.success) {
                setClasses(prev => prev.filter(c => c.id !== classId));
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Delete error:', err);
            return false;
        }
    };

    const createClass = async (data) => {
        try {
            const result = await classRepository.create(data);
            if (result.success) {
                loadClasses();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateClass = async (id, data) => {
        try {
            const result = await classRepository.update(id, data);
            if (result.success) {
                loadClasses();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        classes,
        teachers, // Expose for form
        searchQuery,
        setSearchQuery,
        isLoading,
        error,
        handleDelete,
        createClass,
        updateClass,
        refresh: loadClasses
    };
}
