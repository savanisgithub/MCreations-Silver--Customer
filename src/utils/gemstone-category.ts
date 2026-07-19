import type { GemstoneCategory } from "../types/gemstone.type";

export interface FlatGemstoneCategory {
    id: number;
    name: string;
    description: string | null;
    parent_id: number | null;
    parent_name: string | null;
    level: 0 | 1;
}

export function flattenGemstoneCategories(
    categories: GemstoneCategory[],
): FlatGemstoneCategory[] {
    return categories.flatMap((category) => {
        const mainCategory: FlatGemstoneCategory = {
            id: category.id,
            name: category.name,
            description: category.description,
            parent_id: category.parent_id,
            parent_name: null,
            level: 0,
        };

        const children: FlatGemstoneCategory[] = (category.children || []).map(
            (child) => ({
                id: child.id,
                name: child.name,
                description: child.description,
                parent_id: child.parent_id,
                parent_name: category.name,
                level: 1,
            }),
        );

        return [mainCategory, ...children];
    });
}