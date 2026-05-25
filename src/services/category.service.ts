import type { ApiResponse } from '../types/api.types';
import type { Category } from '../types/category.types';
import { api } from './api';

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const response = await api.get<ApiResponse<Category[]>>('/categories');
        return response.data.data;
    },

    async getCategoryBySlug(slug: string): Promise<Category> {
        const response = await api.get<ApiResponse<Category>>(
            `/categories/slug/${slug}`,
        );

        return response.data.data;
    },
};