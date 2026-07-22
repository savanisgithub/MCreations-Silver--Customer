import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import type { FlatGemstoneCategory } from '../../utils/gemstone-category';

interface GemstoneFilterPanelProps {
    search: string;
    categoryId: number | '';
    categories: FlatGemstoneCategory[];
    categoriesLoading: boolean;
    categoriesIsError: boolean;
    categoriesErrorMessage?: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: number | '') => void;
    onReset: () => void;
}

export default function GemstoneFilterPanel({
    search,
    categoryId,
    categories,
    categoriesLoading,
    categoriesIsError,
    categoriesErrorMessage,
    onSearchChange,
    onCategoryChange,
    onReset,
}: GemstoneFilterPanelProps) {
    const hasFilters = Boolean(search.trim()) || categoryId !== '';

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
                label="Search gemstones"
                placeholder="Search by stone name"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                fullWidth
            />

            <FormControl
                fullWidth
                disabled={categoriesLoading || categoriesIsError}
            >
                <InputLabel>Gemstone Category</InputLabel>

                <Select
                    label="Gemstone Category"
                    value={categoryId}
                    onChange={(event) => {
                        const rawValue = String(event.target.value);

                        onCategoryChange(
                            rawValue === '' ? '' : Number(rawValue),
                        );
                    }}
                >
                    <MenuItem value="">All Gemstones</MenuItem>

                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    width: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        width:
    category.level > 0
        ? Math.min(category.level * 14, 42)
        : 0,
                                        height: 1,
                                        bgcolor:
                                            category.level > 0
                                                ? '#CBD5E1'
                                                : 'transparent',
                                        flexShrink: 0,
                                    }}
                                />

                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight:
                                            category.level === 0 ? 900 : 600,
                                        color:
                                            category.level === 0
                                                ? '#111827'
                                                : 'text.secondary',
                                    }}
                                >
                                    {category.name}
                                </Box>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {categoriesIsError && (
                <Alert severity="warning">
                    {categoriesErrorMessage ||
                        'Failed to load gemstone categories'}
                </Alert>
            )}

            <Button
                variant={hasFilters ? 'contained' : 'outlined'}
                onClick={onReset}
                disabled={!hasFilters}
                sx={{
                    fontWeight: 800,
                }}
            >
                Reset Filters
            </Button>
        </Box>
    );
}
