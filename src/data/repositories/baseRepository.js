import { supabase } from '../supabaseClient';
import { success, failure, ErrorCodes } from '../types';

/**
 * Base Repository Class
 * Provides common CRUD operations and error handling for Supabase
 */
export class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
        this.supabase = supabase;
    }

    /**
     * Generic fetch all
     * @returns {Promise<import('../types').Result<any[]>>}
     */
    async getAll() {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*');

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error(`[BaseRepo] getAll ${this.tableName} error:`, error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Generic get by ID
     * @param {string|number} id 
     * @returns {Promise<import('../types').Result<any>>}
     */
    async getById(id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return failure('Not found', ErrorCodes.NOT_FOUND);
                throw error;
            }
            return success(data);
        } catch (error) {
            console.error(`[BaseRepo] getById ${this.tableName} error:`, error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Generic create
     * @param {object} item 
     * @returns {Promise<import('../types').Result<any>>}
     */
    async create(item) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert([item])
                .select()
                .single();

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error(`[BaseRepo] create ${this.tableName} error:`, error);
            return failure(error.message, ErrorCodes.SERVER_ERROR);
        }
    }
}
