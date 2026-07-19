import type { ApiResponse } from '../types/api.types';
import type { GemstoneCategory } from '../types/gemstone.type';
import { api } from './api';

export const gemstoneCategoryService = {
    async getPublicTree(): Promise<GemstoneCategory[]> {
        const response = await api.get<ApiResponse<GemstoneCategory[]>>(
            '/gemstone-categories',
        );

        return response.data.data;
    },
};