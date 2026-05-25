import type { ApiResponse, PaginatedApiResponse } from '../types/api.types';
import type { JewelleryFilterParams, JewelleryItem } from '../types/jewellery.types';
import { api } from './api';

export const jewelleryService = {
    async getJewelleryItems(
        params: JewelleryFilterParams,
    ): Promise<PaginatedApiResponse<JewelleryItem>> {
        const response = await api.get<PaginatedApiResponse<JewelleryItem>>(
            '/jewellery',
            {
                params,
            },
        );

        return response.data;
    },

    async getJewelleryBySlug(slug: string): Promise<JewelleryItem> {
        const response = await api.get<ApiResponse<JewelleryItem>>(
            `/jewellery/slug/${slug}`,
        );

        return response.data.data;
    },

    async getJewelleryByCategorySlug(slug: string): Promise<JewelleryItem[]> {
        const response = await api.get<ApiResponse<JewelleryItem[]>>(
            `/jewellery/category/${slug}`,
        );

        return response.data.data;
    },
};