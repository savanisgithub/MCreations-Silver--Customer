import type { Status } from './category.types';

export type GemstoneImageType = 'STONE_IMAGE' | 'CERTIFICATE_IMAGE';

export interface GemstoneCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    image_public_id: string | null;
    parent_id: number | null;
    status: Status;
    children?: GemstoneCategory[];
}

export interface GemstoneImage {
    id: number;
    image_url: string;
    public_id: string | null;
    image_type: GemstoneImageType;
    is_primary: boolean;
    gemstone_id: number;
}

export interface Gemstone {
    id: number;
    name: string;
    slug: string;
    carat: string | number | null;
    weight: string | number | null;
    size: string | null;
    description: string | null;
    status: Status;
    gemstone_category_id: number;
    category?: GemstoneCategory;
    images: GemstoneImage[];
    created_at: string;
    updated_at: string;
}

export interface GemstoneFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    gemstone_category_id?: number;
}