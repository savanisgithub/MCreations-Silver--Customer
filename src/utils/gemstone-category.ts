import type { GemstoneCategory } from "../types/gemstone.type";

export interface FlatGemstoneCategory {
    id: number;
    name: string;
    description: string | null;
    parent_id: number | null;
    parent_name: string | null;
    level: number;
}

export function flattenGemstoneCategories(
    categories: GemstoneCategory[],
    parentName: string | null = null,
    level = 0,
): FlatGemstoneCategory[] {
    return categories.flatMap((category) => {
        const flatCategory: FlatGemstoneCategory = {
            id: category.id,
            name: category.name,
            description: category.description,
            parent_id: category.parent_id,
            parent_name: parentName,
            level,
        };

        const children = flattenGemstoneCategories(
            category.children || [],
            category.name,
            level + 1,
        );

        return [flatCategory, ...children];
    });
}

function findGemstoneCategory(
    categories: GemstoneCategory[],
    categoryId: number,
): GemstoneCategory | undefined {
    for (const category of categories) {
        if (category.id === categoryId) {
            return category;
        }

        const childMatch = findGemstoneCategory(
            category.children || [],
            categoryId,
        );

        if (childMatch) {
            return childMatch;
        }
    }

    return undefined;
}

function collectGemstoneCategoryIds(category: GemstoneCategory): number[] {
    return [
        category.id,
        ...(category.children || []).flatMap(collectGemstoneCategoryIds),
    ];
}

export function getGemstoneCategoryAndDescendantIds(
    categories: GemstoneCategory[],
    categoryId: number,
): number[] {
    const category = findGemstoneCategory(categories, categoryId);

    if (!category) {
        return [categoryId];
    }

    return collectGemstoneCategoryIds(category);
}
