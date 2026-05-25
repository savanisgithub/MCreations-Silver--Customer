import type { Category, Status } from "./category.types";

export type JewelleryMaterial = 'SILVER' | 'GOLD' | 'PLATINUM' | 'OTHER';

export interface JewelleryImage {
    id: number;
    image_url: string;
    public_id: string | null;
    is_primary: boolean;
    jewellery_item_id: number;
    created_at: string;
}

export interface JewelleryItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    material: JewelleryMaterial;
    stones: string | null;
    price: string | number | null;
    weight: string | number | null;
    stock: number;
    sku: string | null;
    status: Status;
    category_id: number;
    category?: Category;
    images: JewelleryImage[];
    created_at: string;
    updated_at: string;
}

export interface JewelleryFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    material?: JewelleryMaterial;
    category_id?: number;
    min_price?: number;
    max_price?: number;
}