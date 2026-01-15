import { useState, useEffect, useCallback } from 'react';
import { vocabRepository } from '../data/vocabRepository';

/**
 * useVocabularyList - Hook for managing vocabulary list
 */
export function useVocabularyList(options = {}) {
    const [vocabulary, setVocabulary] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load vocabulary
    const loadVocabulary = useCallback(async (queryOptions = {}) => {
        setIsLoading(true);
        setError(null);

        const result = await vocabRepository.getAll({ ...options, ...queryOptions });
        if (result.success) {
            setVocabulary(result.data);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    }, [options]);

    // Load categories
    const loadCategories = useCallback(async () => {
        const result = await vocabRepository.getCategories();
        if (result.success) {
            setCategories(result.data);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadVocabulary();
        loadCategories();
    }, [loadVocabulary, loadCategories]);

    // Create vocabulary
    const createVocabulary = useCallback(async (data) => {
        const result = await vocabRepository.create(data);
        if (result.success) {
            await loadVocabulary();
        }
        return result;
    }, [loadVocabulary]);

    // Update vocabulary
    const updateVocabulary = useCallback(async (id, updates) => {
        const result = await vocabRepository.update(id, updates);
        if (result.success) {
            await loadVocabulary();
        }
        return result;
    }, [loadVocabulary]);

    // Delete vocabulary
    const deleteVocabulary = useCallback(async (id) => {
        const result = await vocabRepository.delete(id);
        if (result.success) {
            await loadVocabulary();
        }
        return result;
    }, [loadVocabulary]);

    // Refresh
    const refresh = useCallback(() => {
        loadVocabulary();
    }, [loadVocabulary]);

    return {
        vocabulary,
        categories,
        isLoading,
        error,
        createVocabulary,
        updateVocabulary,
        deleteVocabulary,
        refresh,
    };
}
