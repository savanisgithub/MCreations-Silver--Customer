import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Container,
    Drawer,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import GemstoneCard from '../../components/common/GemstoneCard';
import PageError from '../../components/common/PageError';
import PageLoading from '../../components/common/PageLoading';
import PageTransition from '../../components/common/PageTransition';
import { gemstoneCategoryService } from '../../services/gemstone-category.service';
import { gemstoneService } from '../../services/gemstone.service';
import { useDebounce } from '../../hooks/useDebounce';
import type { GemstoneCategory } from '../../types/gemstone.type';

function flattenGemstoneCategories(categories: GemstoneCategory[]): GemstoneCategory[] {
    return categories.flatMap((category) => [
        category,
        ...flattenGemstoneCategories(category.children || []),
    ]);
}

function getCategoryAndDescendantIds(category?: GemstoneCategory) {
    if (!category) {
        return [] as number[];
    }

    return [
        category.id,
        ...flattenGemstoneCategories(category.children || []).map((child) => child.id),
    ];
}

export default function GemstoneListPage() {
    const location = useLocation();

    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );

    const categoryFromUrl = searchParams.get('category');
    const categoryFromUrlId = categoryFromUrl ? Number(categoryFromUrl) : '';

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>(
        Number.isFinite(categoryFromUrlId) ? categoryFromUrlId : '',
    );
    const [filterOpen, setFilterOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 450);
    const limit = 12;

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryKey: ['gemstone-category-tree'],
        queryFn: gemstoneCategoryService.getPublicTree,
    });

    const flatCategories = flattenGemstoneCategories(categories);
    const selectedCategory = flatCategories.find((category) => category.id === categoryId);
    const selectedCategoryIds = useMemo(
        () => getCategoryAndDescendantIds(selectedCategory),
        [selectedCategory],
    );

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['gemstones', page, debouncedSearch, categoryId, selectedCategoryIds.join(',')],
        queryFn: () =>
            categoryId === '' || selectedCategoryIds.length === 0
                ? gemstoneService.getGemstones({
                      page,
                      limit,
                      search: debouncedSearch || undefined,
                  })
                : gemstoneService.getGemstonesByCategoryIds(selectedCategoryIds, {
                      page,
                      limit,
                      search: debouncedSearch || undefined,
                  }),
    });

    useEffect(() => {
        if (Number.isFinite(categoryFromUrlId)) {
            setCategoryId(categoryFromUrlId);
            setPage(1);
            return;
        }

        setCategoryId('');
        setPage(1);
    }, [categoryFromUrlId]);

    function resetFilters() {
        setSearch('');
        setCategoryId('');
        setPage(1);
    }

    function handleCategoryChange(value: string | number) {
        const rawValue = String(value);
        setCategoryId(rawValue === '' ? '' : Number(rawValue));
        setPage(1);
    }

    const filterContent = (
        <Stack spacing={2}>
            <TextField
                label="Search gemstones"
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                }}
                fullWidth
                size="small"
            />

            <FormControl fullWidth disabled={categoriesLoading || categoriesError} size="small">
                <InputLabel id="gemstone-category-label" shrink>
                    Gemstone category
                </InputLabel>
                <Select
                    labelId="gemstone-category-label"
                    label="Gemstone category"
                    notched
                    value={categoryId}
                    onChange={(event) => handleCategoryChange(event.target.value)}
                    displayEmpty
                    renderValue={(value) => {
                        if (typeof value !== 'number') {
                            return 'All gemstones';
                        }

                        return selectedCategory?.name || 'Selected category';
                    }}
                    MenuProps={{
                        slotProps: {
                            paper: {
                            sx: {
                                mt: 1,
                                borderRadius: 1,
                                border: '1px solid rgba(15,23,42,0.10)',
                                boxShadow: '0 24px 60px rgba(15,23,42,0.16)',
                            },
                            },
                        },
                    }}
                >
                    <MenuItem value="">All gemstones</MenuItem>

                    {categories.map((category) => [
                        // <ListSubheader
                        //     key={`header-${category.id}`}
                        //     sx={{
                        //         lineHeight: 2.25,
                        //         fontWeight: 800,
                        //         color: 'text.primary',
                        //         bgcolor: '#F8FAFC',
                        //     }}
                        // >
                        //     {category.name}
                        // </ListSubheader>,
                        <MenuItem key={category.id} value={category.id} sx={{ fontWeight: 700 }}>
                            {category.name}
                        </MenuItem>,
                        ...(category.children || []).map((child) => (
                            <MenuItem key={child.id} value={child.id} sx={{ pl: 4 }}>
                                {child.name}
                            </MenuItem>
                        )),
                    ])}
                </Select>
            </FormControl>

            <Button variant="outlined" onClick={resetFilters} sx={{ alignSelf: 'flex-start' }}>
                Reset filters
            </Button>

            {/* {selectedCategory && (
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: 'rgba(191,164,111,0.10)',
                        border: '1px solid rgba(191,164,111,0.28)',
                    }}
                >
                    <Typography variant="overline" sx={{ letterSpacing: '0.14em' }}>
                        Active selection
                    </Typography>
                    <Typography sx={{ fontWeight: 800, mt: 0.25 }}>
                        {selectedCategory.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Includes gemstones from its subcategories.
                    </Typography>
                </Box>
            )} */}
        </Stack>
    );

    const resultCount = data?.meta.total ?? 0;
    const resultLabel = categoryId === '' ? 'All gemstones' : selectedCategory?.name || 'Selected category';

    return (
        <PageTransition>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: '#0F172A',
                    color: 'common.white',
                    py: { xs: 2, md: 4 },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(circle at top right, rgba(191,164,111,0.22), transparent 34%), radial-gradient(circle at left center, rgba(255,255,255,0.08), transparent 28%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                            gap: 4,
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                        <Box>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: 'secondary.light',
                                    letterSpacing: '0.2em',
                                    fontWeight: 800,
                                }}
                            >
                                Gemstone Collection
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily: 'Georgia, Times New Roman, serif',
                                    fontSize: { xs: 40, md: 62 },
                                    lineHeight: 1.08,
                                    mt: 1,
                                }}
                            >
                                {selectedCategory?.name || 'Explore Gemstones'}
                            </Typography>

                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.72)',
                                    maxWidth: 680,
                                    mt: 2,
                                    fontSize: { xs: 16, md: 18 },
                                    lineHeight: 1.7,
                                }}
                            >
                                {selectedCategory?.description ||
                                    'Browse gemstones by family and view stone images, measurements, and available certificate imagery.'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'grid' }, placeItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 240,
                                    height: 240,
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <DiamondIcon sx={{ fontSize: 108, color: 'secondary.light' }} />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: 'Georgia, Times New Roman, serif',
                                fontSize: { xs: 32, md: 44 },
                            }}
                        >
                            Available Stones
                        </Typography>

                        <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                            Refine gemstones by category or search by stone name. Selecting a
                            parent category includes its subcategory gemstones.
                        </Typography>
                    </Box>

                    <Button
                        startIcon={<TuneIcon />}
                        variant="outlined"
                        onClick={() => setFilterOpen(true)}
                        sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                    >
                        Filters
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '290px 1fr' },
                        gap: 4,
                        alignItems: 'start',
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'sticky',
                            top: 104,
                            border: '1px solid rgba(15,23,42,0.08)',
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            p: 3,
                            boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 800 }}>
                            Refine gemstones
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Use the dropdown to browse a family or one of its subcategories.
                        </Typography>

                        {filterContent}
                    </Box>

                    <Box>
                        {isLoading && <PageLoading minHeight={420} />}

                        {isError && (
                            <PageError
                                message={(error as any)?.message || 'Failed to load gemstones'}
                            />
                        )}

                        {!isLoading && !isError && data?.data.length === 0 && (
                            <EmptyState message="No gemstones found." />
                        )}

                        {!isLoading && !isError && data && data.data.length > 0 && (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: 2,
                                        mb: 2.5,
                                        flexDirection: { xs: 'column', sm: 'row' },
                                    }}
                                >
                                    
                                    {selectedCategory && (
                                        <Chip
                                            label={`Filtered by ${selectedCategory.name}`}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            sm: 'repeat(2, 1fr)',
                                            lg: 'repeat(3, 1fr)',
                                        },
                                        gap: 3,
                                    }}
                                >
                                    {data.data.map((gemstone) => (
                                        <GemstoneCard key={gemstone.id} gemstone={gemstone} />
                                    ))}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 5,
                                    }}
                                >
                                    <Pagination
                                        page={page}
                                        count={data.meta.total_pages || 1}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>

            <Drawer
                anchor="right"
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: '100%', sm: 380 },
                        },
                    },
                }}
            >
                <Box sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Gemstone filters
                        </Typography>

                        <IconButton onClick={() => setFilterOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {filterContent}
                </Box>
            </Drawer>
        </PageTransition>
    );
}
