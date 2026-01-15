import { useState, useCallback } from 'react';

/**
 * useEntityMutation - Generic hook for entity mutations (create/update/delete)
 * @param {Object} repository - Repository with create, update, delete
 * @param {Function} onSuccess - Callback on successful mutation
 */
export function useEntityMutation(repository, onSuccess) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = useCallback(async (data) => {
        setIsLoading(true);
        setError(null);

        const result = await repository.create(data);
        setIsLoading(false);

        if (result.success) {
            onSuccess?.();
        } else {
            setError(result.error);
        }

        return result;
    }, [repository, onSuccess]);

    const update = useCallback(async (id, data) => {
        setIsLoading(true);
        setError(null);

        const result = await repository.update(id, data);
        setIsLoading(false);

        if (result.success) {
            onSuccess?.();
        } else {
            setError(result.error);
        }

        return result;
    }, [repository, onSuccess]);

    const remove = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);

        const result = await repository.delete(id);
        setIsLoading(false);

        if (result.success) {
            onSuccess?.();
        } else {
            setError(result.error);
        }

        return result;
    }, [repository, onSuccess]);

    const clearError = useCallback(() => setError(null), []);

    return {
        isLoading,
        error,
        create,
        update,
        remove,
        clearError,
    };
}
