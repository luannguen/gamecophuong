import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';

class StudentRepository extends BaseRepository {
    constructor() {
        super('students');
    }

    /**
     * Login student by PIN code
     * @param {string} pinCode 
     * @returns {Promise<import('../../../../data/types').Result<object>>}
     */
    async login(pinCode) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('pin_code', pinCode)
                .single();

            if (error) throw error;
            if (!data) return failure('Invalid PIN code', ErrorCodes.NOT_FOUND);

            return success(data);
        } catch (error) {
            console.error('[StudentRepo] login error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Find student by display name
     * @param {string} name 
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async findByName(name) {
        try {
            const { data, error } = await this.supabase
                .from('students')
                .select('*')
                .ilike('display_name', `%${name}%`)
                .limit(1);

            if (error) throw error;
            // No failure if not found, just null data in Result pattern usually, 
            // or specific behavior. For strict find, maybe error.
            if (!data || data.length === 0) return failure('Student not found', ErrorCodes.NOT_FOUND);

            return success(data[0]);
        } catch (error) {
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    async getAll() {
        return this.baseGetAll();
    }

    async delete(id) {
        try {
            const { error } = await this.supabase
                .from('students')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return success(true);
        } catch (error) {
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }
}

export const studentRepository = new StudentRepository();
