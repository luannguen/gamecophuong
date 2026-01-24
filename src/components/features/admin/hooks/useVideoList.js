import { useState, useEffect, useCallback } from 'react';
import { videoRepository } from '../data/videoRepository';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export function useVideoList() {
    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const loadVideos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await videoRepository.getAll();
            if (result.success) {
                let data = result.data || [];
                // Client-side search filtering (since DB is small, simpler than SQL for now)
                if (debouncedSearch) {
                    const lowerQ = debouncedSearch.toLowerCase();
                    data = data.filter(v =>
                        v.title?.toLowerCase().includes(lowerQ) ||
                        v.category?.toLowerCase().includes(lowerQ)
                    );
                }
                setVideos(data);
            } else {
                setError(result.error);
                setVideos([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    const createVideo = async (data) => {
        const result = await videoRepository.create(data);
        if (result.success) {
            loadVideos();
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const updateVideo = async (id, data) => {
        const result = await videoRepository.update(id, data);
        if (result.success) {
            loadVideos();
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const handleDelete = async (id) => {
        const result = await videoRepository.delete(id);
        if (result.success) {
            setVideos(prev => prev.filter(v => v.id !== id));
            return true;
        }
        return false;
    };

    return {
        videos,
        searchQuery,
        setSearchQuery,
        isLoading,
        error,
        createVideo,
        updateVideo,
        handleDelete,
        refresh: loadVideos
    };
}
