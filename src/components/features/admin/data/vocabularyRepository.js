import { supabase } from '../../../../data/supabaseClient';

// Helper to handle response
const handleResponse = (response) => {
    if (response.error) {
        console.error('Supabase Error:', response.error);
        return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
};

export const vocabularyRepository = {
    // Get all vocabulary items, optionally filtered by category
    getAll: async (categoryId = null) => {
        let query = supabase
            .from('vocabulary')
            .select(`
                *,
                categories (
                    id,
                    name,
                    icon,
                    color_code
                )
            `)
            .order('created_at', { ascending: false });

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const response = await query;
        console.log('Vocabulary getAll response:', response); // Debug Log
        if (response.error) {
            console.error('Supabase Error:', response.error);
            return { success: false, error: response.error };
        }

        // Map data to flat structure if needed, or keep as is
        const data = response.data.map(item => ({
            ...item,
            category_name: item.categories?.name,
            category_color: item.categories?.color_code,
            category_icon: item.categories?.icon
        }));

        return { success: true, data };
    },

    // Get a single vocabulary item by ID
    getById: async (id) => {
        const response = await supabase
            .from('vocabulary')
            .select('*')
            .eq('id', id)
            .single();
        return handleResponse(response);
    },

    // Create a new vocabulary item
    create: async (data) => {
        // Ensure data maps to DB columns
        const dbPayload = {
            word: data.word,
            meaning: data.meaning,
            pronunciation: data.pronunciation,
            category_id: data.category_id, // UUID
            image_url: data.image_url,
            audio_url: data.audio_url,
            is_active: data.is_active
        };

        const response = await supabase
            .from('vocabulary')
            .insert([dbPayload])
            .select()
            .single();
        return handleResponse(response);
    },

    // Update an existing vocabulary item
    update: async (id, data) => {
        const dbPayload = {
            word: data.word,
            meaning: data.meaning,
            pronunciation: data.pronunciation,
            category_id: data.category_id,
            image_url: data.image_url,
            audio_url: data.audio_url,
            is_active: data.is_active
        };

        const response = await supabase
            .from('vocabulary')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();
        return handleResponse(response);
    },

    // Delete a vocabulary item
    delete: async (id) => {
        const response = await supabase
            .from('vocabulary')
            .delete()
            .eq('id', id);
        return handleResponse(response);
    }
};
