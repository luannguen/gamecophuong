import { useState } from 'react';
import { storageRepository } from '../../../data/storageRepository';

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const uploadImage = async (file) => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const result = await storageRepository.uploadAvatar(file);

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
        }
    };

    return {
        uploadImage,
        isUploading,
        uploadError
    };
}
