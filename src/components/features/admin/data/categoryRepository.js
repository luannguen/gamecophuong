import { supabase } from '../../../../data/supabaseClient';

export const categoryRepository = {
    // Fetch all categories
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            // Map fields to match application standard (icon, color)
            const mappedData = data.map(cat => ({
                id: cat.id,
                name: cat.name,
                icon: cat.icon || 'category', // Fallback
                color: cat.color_code || '#ccc',
                image_url: cat.image_url, // Changed from icon_url to image_url matches migration
                slug: cat.slug
            }));

            return { success: true, data: mappedData };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { success: false, error: error.message, data: [] };
        }
    },

    // Create new category
    async create(categoryData) {
        try {
            const dbPayload = {
                name: categoryData.name,
                icon: categoryData.icon,
                color_code: categoryData.color,
                image_url: categoryData.image_url, // Added image_url
                slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
                sort_order: 99
            };

            const { data, error } = await supabase
                .from('categories')
                .insert([dbPayload])
                .select()
                .single();

            if (error) throw error;

            // Map back
            const mapped = {
                id: data.id,
                name: data.name,
                icon: data.icon,
                color: data.color_code,
                image_url: data.image_url,
                slug: data.slug
            };

            return { success: true, data: mapped };
        } catch (error) {
            console.error('Error creating category:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete category
    async delete(id) {
        try {
            const { error } = await supabase
                .from('categories')
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
