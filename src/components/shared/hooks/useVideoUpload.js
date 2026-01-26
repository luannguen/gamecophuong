import { useState } from 'react';
import { storageRepository } from '../../../data/storageRepository';

export function useVideoUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadVideo = async (file) => {
        setIsUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        try {
            // Note: Supabase JS upload is basic, progress tracking might need custom config if supported by repo
            // For now we just await the promise.
            const result = await storageRepository.uploadLessonVideo(file);

            if (!result.success) {
                setUploadError(result.error || 'Upload failed');
                return null;
            }

            return result.data; // URL
        } catch (err) {
            setUploadError(err.message || 'Unexpected upload error');
            return null;
        } finally {
            setIsUploading(false);
            setUploadProgress(100);
        }
    };

    return {
        uploadVideo,
        isUploading,
        uploadProgress,
        uploadError
    };
}
