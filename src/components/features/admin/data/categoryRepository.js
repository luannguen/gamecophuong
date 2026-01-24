import { supabase } from '../../../../data/supabaseClient';

export const categoryRepository = {
    // Fetch all categories
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('video_categories')
                .select('*')
                .order('name', { ascending: true }); // Sort alphabetically

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to empty array if table doesn't exist yet (to prevent crash)
            return { success: false, error: error.message, data: [] };
        }
    },

    // Create new category
    async create(categoryData) {
        try {
            const { data, error } = await supabase
                .from('video_categories')
                .insert([categoryData])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error creating category:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete category
    async delete(id) {
        try {
            const { error } = await supabase
                .from('video_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, error: error.message };
        }
    }
};
