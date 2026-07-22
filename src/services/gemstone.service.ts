import type { ApiResponse, PaginatedApiResponse } from '../types/api.types';
import type { Gemstone, GemstoneFilterParams } from '../types/gemstone.type';
import { api } from './api';

const CATEGORY_GROUP_FETCH_LIMIT = 100;

async function getGemstones(
    params: GemstoneFilterParams,
): Promise<PaginatedApiResponse<Gemstone>> {
    const response = await api.get<PaginatedApiResponse<Gemstone>>(
        '/gemstones',
        { params },
    );

    return response.data;
}

async function getAllGemstonesForCategory(
    categoryId: number,
    search?: string,
) {
    const firstPage = await getGemstones({
        page: 1,
        limit: CATEGORY_GROUP_FETCH_LIMIT,
        search,
        gemstone_category_id: categoryId,
    });

    const totalPages = firstPage.meta.total_pages || 1;

    if (totalPages <= 1) {
        return firstPage.data;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
            getGemstones({
                page: index + 2,
                limit: CATEGORY_GROUP_FETCH_LIMIT,
                search,
                gemstone_category_id: categoryId,
            }),
        ),
    );

    return [
        ...firstPage.data,
        ...remainingPages.flatMap((response) => response.data),
    ];
}

function sortNewestFirst(a: Gemstone, b: Gemstone) {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();

    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
        return bTime - aTime;
    }

    return b.id - a.id;
}

export const gemstoneService = {
    async getGemstones(
        params: GemstoneFilterParams,
    ): Promise<PaginatedApiResponse<Gemstone>> {
        const response = await api.get<PaginatedApiResponse<Gemstone>>(
            '/gemstones',
            { params },
        );

        return response.data;
    },

    async getGemstonesByCategoryIds(
        categoryIds: number[],
        params: Omit<GemstoneFilterParams, 'gemstone_category_id'>,
    ): Promise<PaginatedApiResponse<Gemstone>> {
        const page = params.page || 1;
        const limit = params.limit || 12;
        const uniqueCategoryIds = Array.from(new Set(categoryIds));

        const categoryResults = await Promise.all(
            uniqueCategoryIds.map((categoryId) =>
                getAllGemstonesForCategory(categoryId, params.search),
            ),
        );

        const uniqueGemstones = new Map<number, Gemstone>();

        categoryResults.flat().forEach((gemstone) => {
            uniqueGemstones.set(gemstone.id, gemstone);
        });

        const gemstones = Array.from(uniqueGemstones.values()).sort(sortNewestFirst);
        const total = gemstones.length;
        const start = (page - 1) * limit;
        const totalPages = Math.max(Math.ceil(total / limit), 1);

        return {
            success: true,
            message: 'Gemstones fetched successfully',
            data: gemstones.slice(start, start + limit),
            meta: {
                page,
                limit,
                total,
                total_pages: totalPages,
            },
        };
    },

    async getGemstoneBySlug(slug: string): Promise<Gemstone> {
        const response = await api.get<ApiResponse<Gemstone>>(
            `/gemstones/slug/${slug}`,
        );

        return response.data.data;
    },
};
