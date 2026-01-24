import { supabase } from '../../../../data/supabaseClient';

export const videoRepository = {
    // Fetch all videos
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching videos:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new video
    async create(videoData) {
        try {
            const { data, error } = await supabase
                .from('videos')
                .insert([videoData])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error creating video:', error);
            return { success: false, error: error.message };
        }
    },

    // Update video
    async update(id, videoData) {
        try {
            const { data, error } = await supabase
                .from('videos')
                .update(videoData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error updating video:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete video
    async delete(id) {
        try {
            const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting video:', error);
            return { success: false, error: error.message };
        }
    }
};
