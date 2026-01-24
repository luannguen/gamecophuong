import { useState, useEffect, useCallback } from 'react';
import { parentRepository } from '../data/parentRepository';
import { useDebounce } from '../../../shared/hooks/useDebounce';

/**
 * Hook to manage parent list logic
 */
export function useParentList() {
    const [parents, setParents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const loadParents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await parentRepository.getFiltered({
                search: debouncedSearch
            });

            if (result.success) {
                setParents(result.data || []);
            } else {
                setError(result.error);
                setParents([]);
            }
        } catch (err) {
            console.error('Error loading parents:', err);
            setError(err.message);
            setParents([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        loadParents();
    }, [loadParents]);

    const handleDelete = async (parentId) => {
        const result = await parentRepository.delete(parentId);
        if (result.success) {
            setParents(prev => prev.filter(p => p.id !== parentId));
            return true;
        }
        return false;
    };

    const createParent = async (data) => {
        const result = await parentRepository.create(data);
        if (result.success) {
            loadParents();
            return { success: true, data: result.data }; // Return data for linking children
        }
        return { success: false, error: result.error };
    };

    const updateParent = async (id, data) => {
        const result = await parentRepository.update(id, data);
        if (result.success) {
            loadParents();
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    return {
        parents,
        searchQuery,
        setSearchQuery,
        isLoading,
        error,
        handleDelete,
        createParent,
        updateParent,
        refresh: loadParents
    };
}
