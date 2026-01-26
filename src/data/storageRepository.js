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

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return failure('File size too large. Max 10MB.', ErrorCodes.VALIDATION_ERROR);
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
    },

    /**
     * Upload lesson video to Supabase Storage (videos bucket)
     * @param {File} file
     * @returns {Promise<Result<string>>} - Public URL
     */
    uploadLessonVideo: async (file) => {
        try {
            if (!file) return failure('No file provided', ErrorCodes.VALIDATION_ERROR);

            if (!file.type.startsWith('video/')) {
                return failure('Invalid file type. Only video files are allowed.', ErrorCodes.VALIDATION_ERROR);
            }

            // Max 100MB for now (Supabase free tier limits)
            if (file.size > 100 * 1024 * 1024) {
                return failure('File size too large. Max 100MB.', ErrorCodes.VALIDATION_ERROR);
            }

            const fileExt = file.name.split('.').pop();
            const filePath = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            // Upload to 'videos' bucket
            const { error } = await supabase.storage
                .from('videos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                // Specific helpful error for RLS/Bucket issues
                if (error.message.includes('Bucket not found')) throw new Error('System Error: "videos" bucket is missing. Please create it in Supabase.');
                if (error.message.includes('row-level security')) throw new Error('Permission Denied: You do not have permission to upload videos.');
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            return success(publicUrl);
        } catch (error) {
            console.error('Video upload error:', error);
            return failure(error.message || 'Failed to upload video', ErrorCodes.SERVER_ERROR);
        }
    },

    /**
     * List all videos in the videos bucket
     * @returns {Promise<Result<Array>>}
     */
    listVideos: async () => {
        try {
            const { data, error } = await supabase.storage
                .from('videos')
                .list('', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) {
                // If bucket doesn't exist, return empty array instead of error
                if (error.message.includes('Bucket not found')) return success([]);
                throw error;
            }

            // Map to full URLs
            const files = data.map(file => {
                const { data: { publicUrl } } = supabase.storage
                    .from('videos')
                    .getPublicUrl(file.name);
                return { ...file, publicUrl };
            });

            return success(files);
        } catch (error) {
            console.error('List videos error:', error);
            return failure(error.message, ErrorCodes.SERVER_ERROR);
        }
    },

    /**
     * Delete a video from the videos bucket
     * @param {string} fileName
     */
    deleteVideo: async (fileName) => {
        try {
            const { error } = await supabase.storage
                .from('videos')
                .remove([fileName]);

            if (error) throw error;
            return success(true);
        } catch (error) {
            console.error('Delete video error:', error);
            return failure(error.message, ErrorCodes.SERVER_ERROR);
        }
    }
};
