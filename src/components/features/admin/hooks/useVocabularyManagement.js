import { useState, useEffect, useCallback } from 'react';
import { vocabularyRepository } from '../data/vocabularyRepository';
import { categoryRepository } from '../data/categoryRepository';
import { useToast } from '../../../shared/hooks/useToast';

export function useVocabularyManagement() {
    // State
    const [vocabulary, setVocabulary] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    // Initial Load
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [vocabResult, catResult] = await Promise.all([
                vocabularyRepository.getAll(),
                categoryRepository.getAll()
            ]);

            if (vocabResult.success) setVocabulary(vocabResult.data || []);
            if (catResult.success) setCategories(catResult.data || []);
        } catch (error) {
            console.error('Initial Load Error', error);
            showToast('Failed to load data', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Actions
    const deleteItem = async (id) => {
        try {
            const result = await vocabularyRepository.delete(id);
            if (result.success) {
                showToast('Deleted successfully', 'success');
                setVocabulary(prev => prev.filter(item => item.id !== id));
                return true;
            } else {
                showToast('Failed to delete', 'error');
                return false;
            }
        } catch (error) {
            showToast('Error deleting item', 'error');
            return false;
        }
    };

    const saveItem = async (data, isUpdate = false, id = null) => {
        try {
            let result;
            if (isUpdate && id) {
                result = await vocabularyRepository.update(id, data);
            } else {
                result = await vocabularyRepository.create(data);
            }

            if (result.success) {
                showToast(isUpdate ? 'Updated successfully' : 'Created successfully', 'success');
                loadData();
                return true;
            } else {
                showToast('Failed to save', 'error');
                return false;
            }
        } catch (error) {
            console.error('Save error', error);
            showToast('An error occurred', 'error');
            return false;
        }
    };

    return {
        vocabulary,
        categories,
        isLoading,
        actions: {
            loadData,
            deleteItem,
            saveItem
        }
    };
}
