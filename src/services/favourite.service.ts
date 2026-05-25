import type { ApiResponse } from '../types/api.types';
import type { Favourite } from '../types/favourite.types';
import { api } from './api';

export const favouriteService = {
    async getMyFavourites(): Promise<Favourite[]> {
        const response = await api.get<ApiResponse<Favourite[]>>('/favourites');
        return response.data.data;
    },

    async addFavourite(jewelleryItemId: number): Promise<Favourite> {
        const response = await api.post<ApiResponse<Favourite>>('/favourites', {
            jewellery_item_id: jewelleryItemId,
        });

        return response.data.data;
    },

    async removeFavourite(jewelleryItemId: number): Promise<void> {
        await api.delete(`/favourites/${jewelleryItemId}`);
    },
};