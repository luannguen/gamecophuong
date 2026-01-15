import { useState, useCallback, useEffect } from 'react';

/**
 * useEntityList - Generic hook for managing entity lists with CRUD
 * @param {Object} repository - Repository with getAll, create, update, delete
 * @param {Object} options - Query options
 */
export function useEntityList(repository, options = {}) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load items
    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const result = await repository.getAll(options);
        if (result.success) {
            setItems(result.data);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    }, [repository, options]);

    // Initial load
    useEffect(() => {
        load();
    }, [load]);

    // Refresh
    const refresh = useCallback(() => load(), [load]);

    return {
        items,
        isLoading,
        error,
        refresh,
        setItems,
    };
}
