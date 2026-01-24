import { supabase } from './supabaseClient';
import { success, failure, ErrorCodes } from './types';

export const storageRepository = {
    /**
     * Upload avatar image to Supabase Storage
     * @param {File} file
     * @param {string} fileName - Optional custom filename, otherwise auto-generated
     * @returns {Promise<Result<string>>} - Public URL of the uploaded image
     */
    uploadAvatar: async (file, fileName = null) => {
        try {
            if (!file) return failure('No file provided', ErrorCodes.VALIDATION_ERROR);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                return failure('Invalid file type. Only images are allowed.', ErrorCodes.VALIDATION_ERROR);
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                return failure('File size too large. Max 2MB.', ErrorCodes.VALIDATION_ERROR);
            }

            const fileExt = file.name.split('.').pop();
            const filePath = fileName || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            return success(publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            return failure(error.message || 'Failed to upload image', ErrorCodes.SERVER_ERROR);
        }
    },

    /**
     * Delete avatar image from Supabase Storage
     * @param {string} url - Full public URL
     */
    deleteAvatar: async (url) => {
        try {
            if (!url) return success(true); // Nothing to delete
            if (!url.includes('/avatars/')) return success(true); // External URL or strict check

            // Extract path from URL
            // Example: https://.../storage/v1/object/public/avatars/filename.jpg
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/avatars/');
            if (pathParts.length < 2) return success(true);

            const path = pathParts[1];

            const { error } = await supabase.storage
                .from('avatars')
                .remove([path]);

            if (error) throw error;

            return success(true);
        } catch (error) {
            console.error('Delete error:', error);
            return failure(error.message, ErrorCodes.SERVER_ERROR);
        }
    }
};
