import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';

class ClassRepository extends BaseRepository {
    constructor() {
        super('classes');
    }

    /**
     * Get all active classes for dropdowns
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getActiveClasses() {
        try {
            // 1. Try RPC First (Secure bypass for RLS recursion)
            const { data: rpcData, error: rpcError } = await this.supabase
                .rpc('get_active_classes');

            if (!rpcError && rpcData) {
                return success(rpcData);
            }

            if (rpcError) {
                console.warn('[ClassRepo] RPC failed, falling back to select:', rpcError);
            }

            // 2. Fallback to direct select
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('id, name')
                .eq('is_active', true)
                .order('name', { ascending: true });

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error('[ClassRepo] getActiveClasses error:', error);
            // Non-blocking error, return empty list
            return success([]);
        }
    }
}

export const classRepository = new ClassRepository();
