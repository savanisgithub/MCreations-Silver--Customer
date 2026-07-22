import { Box, Chip, Typography } from '@mui/material';
import type { FlatGemstoneCategory } from '../../utils/gemstone-category';

interface ActiveGemstoneFiltersProps {
    search: string;
    selectedCategory?: FlatGemstoneCategory;
    resultCount?: number;
    isFetching?: boolean;
    onClearSearch: () => void;
    onClearCategory: () => void;
}

export default function ActiveGemstoneFilters({
    search,
    selectedCategory,
    resultCount,
    isFetching = false,
    onClearSearch,
    onClearCategory,
}: ActiveGemstoneFiltersProps) {
    const hasSearch = Boolean(search.trim());
    const hasCategory = Boolean(selectedCategory);
    const hasFilters = hasSearch || hasCategory;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                mb: 2.5,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                {hasFilters ? (
                    <>
                        {hasSearch && (
                            <Chip
                                label={`Search: ${search}`}
                                onDelete={onClearSearch}
                                variant="outlined"
                            />
                        )}

                        {selectedCategory && (
                            <Chip
                                label={`Category: ${selectedCategory.name}`}
                                onDelete={onClearCategory}
                                color="secondary"
                                variant="outlined"
                            />
                        )}
                    </>
                ) : (
                    <Typography color="text.secondary">
                        Showing all gemstones
                    </Typography>
                )}
            </Box>

            <Typography
                sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                    fontWeight: 700,
                }}
            >
                {isFetching
                    ? 'Updating...'
                    : `${resultCount || 0} gemstone${resultCount === 1 ? '' : 's'
                    } found`}
            </Typography>
        </Box>
    );
}